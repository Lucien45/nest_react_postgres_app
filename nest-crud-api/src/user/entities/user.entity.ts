import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    /**
     * this decorator will help to auto generate id for the table.
     */
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    username: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'int' })
    age: number;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
    /**
     * m - male
     * f - female
     * u - unspecified
     */
    gender: string;
}
