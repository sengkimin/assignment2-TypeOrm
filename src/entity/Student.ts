import { Entity, PrimaryGeneratedColumn, Column, Check } from "typeorm";

@Entity({ name: "Student" })
@Check(`"gender" IN ('Male', 'Female', 'Other')`)
export class Student {
  @PrimaryGeneratedColumn({ name: "student_id" })
  id!: number;

  @Column({ name: "first_name", type: "varchar", length: 50 })
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 50 })
  lastName!: string;

  @Column({ name: "email", type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ name: "phone", type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ name: "birth_date", type: "date", nullable: true })
  birthDate?: Date;

  @Column({ name: "gender", type: "varchar", length: 10 })
  gender!: string;

  @Column({ name: "address", type: "text", nullable: true })
  address?: string;
}
