import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740208264913 implements MigrationInterface {
    name = 'Default1740208264913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Student" ("student_id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20), "birth_date" date, "gender" character varying(10) NOT NULL, "address" text, CONSTRAINT "UQ_9f66856d7166593f257801a87f4" UNIQUE ("email"), CONSTRAINT "CHK_32666b21adb3a391529ce745c1" CHECK ("gender" IN ('Male', 'Female', 'Other')), CONSTRAINT "PK_d3a4bce9a6fb02d86ebb79ab297" PRIMARY KEY ("student_id"))`);
        await queryRunner.query(`CREATE TABLE "Teacher" ("teacher_id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20), CONSTRAINT "UQ_cbc5a391bcaef0e6a63a3f8b021" UNIQUE ("email"), CONSTRAINT "PK_30ff35033d48ee4b4f73ae563f5" PRIMARY KEY ("teacher_id"))`);
        await queryRunner.query(`CREATE TABLE "Class" ("class_id" SERIAL NOT NULL, "class_name" character varying(100) NOT NULL, "subject" character varying(100) NOT NULL, "teacher_id" integer, CONSTRAINT "PK_df37e7d8c60c0c1584afcdf4fda" PRIMARY KEY ("class_id"))`);
        await queryRunner.query(`ALTER TABLE "Class" ADD CONSTRAINT "FK_1eccff21ddbac7ba40bacd1ea25" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Class" DROP CONSTRAINT "FK_1eccff21ddbac7ba40bacd1ea25"`);
        await queryRunner.query(`DROP TABLE "Class"`);
        await queryRunner.query(`DROP TABLE "Teacher"`);
        await queryRunner.query(`DROP TABLE "Student"`);
    }

}
