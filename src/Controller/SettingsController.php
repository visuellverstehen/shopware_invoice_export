<?php declare(strict_types=1);

namespace VisuelInvoiceExport\Controller;

use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\Framework\Context;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Symfony\Component\HttpFoundation\JsonResponse;


/**
 * @RouteScope(scopes={"api"})
 */
class SettingsController extends AbstractController
{
    /**
     * @Route("/api/v{version}/visuel/invoice-export/settings/load", name="api.action.visuel.invoice-export.settings.load", methods={"GET"})
     */
    public function loadSettings(Request $request, Context $context): JsonResponse
    {
        /** @var EntityRepositoryInterface $settingsRepository */
        $settingsRepository = $this->container->get('invoice_export_settings_entity.repository');

        $settings = $settingsRepository->search(
            (new Criteria())->setLimit(1),
            \Shopware\Core\Framework\Context::createDefaultContext()
        );
        return new JsonResponse([$settings]);
    }

    /**
     * @Route("/api/v{version}/visuel/invoice-export/settings/save", name="api.action.visuel.invoice-export.settings.save", methods={"POST"})
     */
    public function saveSettings(Request $request, Context $context): JsonResponse
    {
        /** @var EntityRepositoryInterface $settingsRepository */
        $settingsRepository = $this->container->get('invoice_export_settings_entity.repository');

        $inputSetting = $request->get('settings');

        $data = [];
        if($inputSetting['id']){
            $data = [
                'id' => $inputSetting['id'],
                'debitor' => $inputSetting['debitor'],
                'costNumber' => $inputSetting['costNumber'],
                'taxNumberSeven' => $inputSetting['taxNumberSeven'],
                'taxNumberNineteen' => $inputSetting['taxNumberNineteen'],
                'lastExportAt' => date("Y-m-d H:i:s"),
            ];
        }else{
            $data = [
                'debitor' => $inputSetting['debitor'],
                'costNumber' => $inputSetting['costNumber'],
                'taxNumberSeven' => $inputSetting['taxNumberSeven'],
                'taxNumberNineteen' => $inputSetting['taxNumberNineteen'],
                'lastExportAt' => date("Y-m-d H:i:s"),
            ];
        }

        $setting = $settingsRepository->upsert(
            [
                $data
            ],
            \Shopware\Core\Framework\Context::createDefaultContext()
        );
        return new JsonResponse([$setting]);
    }

}
