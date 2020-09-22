<?php declare(strict_types=1);

namespace VisuelInvoiceExport\Settings;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void              add(SettingsEntity $entity)
 * @method void              set(string $key, SettingsEntity $entity)
 * @method SettingsEntity[]    getIterator()
 * @method SettingsEntity[]    getElements()
 * @method SettingsEntity|null get(string $key)
 * @method SettingsEntity|null first()
 * @method SettingsEntity|null last()
 */
class SettingsEntityCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return SettingsEntity::class;
    }
}
