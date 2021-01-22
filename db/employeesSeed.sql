INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Legal"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 70000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 60000, 4), ("Lawyer", 150000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("I.P.", "Freely", 2, 1), ("Seymour", "Butts", 1, null), ("Ben", "Dover", 4, 3), ("Eileen", "Dover", 3, null), ("Ivana", "Tinkle", 6, null);
