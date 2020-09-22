<?php declare(strict_types=1);

namespace VisuelInvoiceExport\Settings;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\DateTimeField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class SettingsEntityDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'invoice_export_settings_entity';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getCollectionClass(): string
    {
        return SettingsEntityCollection::class;
    }

    public function getEntityClass(): string
    {
        return SettingsEntity::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new PrimaryKey(), new Required()),
            new IntField('debitor', 'debitor'),
            new IntField('cost_number', 'costNumber'),
            new IntField('tax_number_seven', 'taxNumberSeven'),
            new IntField('tax_number_nineteen', 'taxNumberNineteen'),
            new DateTimeField('last_export_at', 'lastExportAt')
        ]);
    }
}
