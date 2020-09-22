<?php declare(strict_types=1);

namespace VisuelInvoiceExport\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1589350319CreateInvoiceExportSettingsTable extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1589350319;
    }

    public function update(Connection $connection): void
    {
        $sql = <<<SQL
CREATE TABLE IF NOT EXISTS `invoice_export_settings_entity` (
    `id` BINARY(16) NOT NULL,
    `debitor` INT(64),
    `cost_number` INT(64),
    `tax_number_seven` INT(64),
    `tax_number_nineteen` INT(64),
    `last_export_at` DATETIME(3),
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3),
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;
SQL;
        $connection->executeUpdate($sql);
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
