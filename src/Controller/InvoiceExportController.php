<?php declare(strict_types=1);

namespace VisuelInvoiceExport\Controller;

use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\Framework\Context;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Symfony\Component\HttpFoundation\JsonResponse;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;


/**
 * @RouteScope(scopes={"api"})
 */
class InvoiceExportController extends AbstractController
{
    /**
     * @Route("/api/v{version}/visuel/invoice-export", name="api.action.visuel.invoice-export", methods={"POST"})
     */
    public function exportInvoices(Request $request, Context $context): Response
    {
        $orderRepository = $this->container->get('order.repository');
        $currencyRepository = $this->container->get('currency.repository');
        $settingsRepository = $this->container->get('invoice_export_settings_entity.repository');
        $languageRepository = $this->container->get('language.repository');

        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('id', $context->getLanguageId()));

        $language = $languageRepository->search($criteria, \Shopware\Core\Framework\Context::createDefaultContext())->first();

        $settings = null;

        $allSettings = $settingsRepository->search(
            new Criteria(),
            \Shopware\Core\Framework\Context::createDefaultContext()
        );

        foreach($allSettings as $entity){
            $settings = $entity;
            break;
        }

        $criteria = new Criteria();
        $criteria->addFilter(new RangeFilter('orderDate', [
            RangeFilter::GTE => $request->get('fromDate'),
            RangeFilter::LTE => $request->get('toDate')
        ]));

        $entities = $orderRepository->search(
            $criteria,
            \Shopware\Core\Framework\Context::createDefaultContext()
        );

        $exportData = [];

        if(count($entities) === 0){
            return new Response('', 204);
        }

        foreach($entities as $order){

            $currencies = $currencyRepository->search(new Criteria([
                $order->getCurrencyId(),
            ]),
            \Shopware\Core\Framework\Context::createDefaultContext()
            )->getEntities();

            $isoCode = 'EUR';
            foreach($currencies as $currency){
                $isoCode = $currency->getIsoCode();
                break;
            }

            $customer = $order->getOrderCustomer();
            $price = $order->getPrice();

            foreach($price->getCalculatedTaxes() as $calculatedTaxes){
                $account = null;
                switch($calculatedTaxes->getTaxRate()){
                    case 7:
                        $account = $settings->taxNumberSeven;
                        break;
                    case 19:
                        $account = $settings->taxNumberNineteen;
                        break;
                }

                switch($language->getName()){
                    case 'English':
                        $exportData[] = [
                            'Date' => $order->getOrderDateTime()->date,
                            'Revenue Account' => $account,
                            'Debtor' => $settings->debitor,
                            'Cost center' => $settings->costNumber,
                            'EUR' => $isoCode,
                            'Invoice' => $calculatedTaxes->getPrice(),
                            'Customer name' => $customer->getFirstName() . ' ' . $customer->getLastName(),
                            'Invoice number' => $order->getOrderNumber()
                        ];
                        break;
                    case 'Deutsch':
                        $exportData[] = [
                            'Datum' => $order->getOrderDateTime()->date,
                            'Erlöskonto' => $account,
                            'Debitor' => $settings->debitor,
                            'Kostenstelle' => $settings->costNumber,
                            'EUR' => $isoCode,
                            'Rechnungsbetrag' => $calculatedTaxes->getPrice(),
                            'Name des Kunden' => $customer->getFirstName() . ' ' . $customer->getLastName(),
                            'Rechnungsnummer' => $order->getOrderNumber()
                        ];
                        break;
                }
            }

        }

        $fileContent = $this->toCSVString($exportData);
        // Return a response with a specific content
        $response = new Response($fileContent);

        // Create the disposition of the file
        $disposition = $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            'export.csv'
        );

        // Set the content disposition
        $response->headers->set('Content-Disposition', $disposition);

        // Dispatch request
        return $response;
    }

    /**
    * Expects an array of associative arrays
    * Takes the first entry and creates a header string
    * Iterates through every entry and creates a column for it in the string
    * @var array $associativeArray
    * @return string $csvString
    */
    private function toCSVString(array $associativeArray): string
    {
        $csvString = '';
        $csvString .= implode(';', array_keys($associativeArray[0])) . "\n";

        foreach($associativeArray as $entry){
            $csvString .= implode(';', $entry) . "\n";
        }
        return $csvString;
    }


}
