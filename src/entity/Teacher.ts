import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "Teacher" })
export class Teacher {
  @PrimaryGeneratedColumn({ name: "teacher_id" })
  id!: number;

  @Column({ name: "first_name", type: "varchar", length: 50 })
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 50 })
  lastName!: string;

  @Column({ name: "email", type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ name: "phone", type: "varchar", length: 20, nullable: true })
  phone?: string;
}
