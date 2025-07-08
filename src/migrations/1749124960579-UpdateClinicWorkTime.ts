import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateClinicWorkTime123456789 implements MigrationInterface {
    name = 'UpdateClinicWorkTime123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "clinic" 
            ALTER COLUMN "workTime" TYPE jsonb 
            USING "workTime"::jsonb
        `);
        
        // Обновляем существующие данные (пример преобразования)
        await queryRunner.query(`
            UPDATE "clinic" 
            SET "workTime" = 
                jsonb_build_object(
                    'Monday', CASE WHEN "workTime" != '' THEN ARRAY[9, 18]::integer[] ELSE NULL END,
                    'Tuesday', NULL,
                    'Wednesday', NULL,
                    'Thursday', NULL,
                    'Friday', NULL,
                    'Saturday', CASE WHEN "workTime" != '' THEN ARRAY[10, 15]::integer[] ELSE NULL END,
                    'Sunday', NULL
                )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Возвращаем обратно к строке (если нужно откатить)
        await queryRunner.query(`
            ALTER TABLE "clinic" 
            ALTER COLUMN "workTime" TYPE text 
            USING "workTime"::text
        `);
    }
}