const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "october23",
  database: "employees_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  init();
});

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "newDept",
      },
    ])
    .then(({ newDept }) => {
      connection.query(
        "INSERT INTO department (department) VALUES (?);",
        [newDept],
        (err, data) => {
          if (err) throw err;
          console.table(data);
          init();
        }
      );
    });
};

const addEmployee = () => {
  const query = "SELECT * FROM role;";
  connection.query(query, function (err, data) {
    if (err) throw err;
    const arrayofRoles = data.map((role) => {
      const empObject = {
        name: role.title,
        value: role.id,
      };
      return empObject;
    });

    var mgrQuery = "SELECT * FROM employee;";
    connection.query(mgrQuery, function (err, data) {
      if (err) throw err;
      const arrayofMgr = data.map((employee) => {
        const mgrUpdate = {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
        return mgrUpdate;
      });



      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee first name?",
            name: "fname",
          },
          {
            type: "input",
            message: "What is the employee last name?",
            name: "lname",
          },
          {
            type: "list",
            message: "What is the employee role?",
            name: "roleId",
            choices: arrayofRoles,
          },
          {
            type: "list",
            message: "Who is the employee's manager?",
            name: "mgrId",
            choices: arrayofMgr,
          },
        ])
        .then(({ fname, lname, roleId, mgrId }) => {
          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
            [fname, lname, roleId, mgrId],
            (err, data) => {
              if (err) throw err;
              console.log(roleId);
              init();
            }
          );
        });
    });
  });
};

const addRole = () => {
  var query = "SELECT * FROM department;";
  connection.query(query, function (err, data) {
    if (err) throw err;
    const arrayofDept = data.map((department) => {
      const deptObject = {
        name: department.department,
        value: department.id,
      };
      return deptObject;
    });

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "roleName",
        },
        {
          type: "number",
          message: "What is the salary for this role?",
          name: "roleSalary",
        },
        {
          type: "list",
          message: "What department does the role belong to?",
          name: "roleDept",
          choices: arrayofDept,
        },
      ])
      .then(({ roleName, roleSalary, roleDept }) => {
        connection.query(
          `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`,
          [roleName, roleSalary, roleDept],
          (err, data) => {
            if (err) throw err;
            console.log(data);
            init();
          }
        );
      });
  });
};

const viewEmployees = () => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department, concat(manager.first_name, " ", manager.last_name) AS manager
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON department.id = role.department_id
        LEFT JOIN employee as manager ON employee.manager_id = manager.id;`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
};

const viewDepartments = () => {
  connection.query(`SELECT * FROM department;`, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  });
};

const viewRoles = () => {
  connection.query(
    `SELECT role.id, title, salary, department 
  FROM role RIGHT JOIN department ON department_id = department.id;`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
};

const updateRole = () => {
  var query = "SELECT * FROM role;";
  connection.query(query, function (err, data) {
    if (err) throw err;
    const arrayofRoles = data.map((role) => {
      const roleUpdate = { name: role.title };
      return roleUpdate;
    });

    var empQuery = "SELECT * FROM employee;";
    connection.query(empQuery, function (err, data) {
      if (err) throw err;
      const arrayofNames = data.map((employee) => {
        const empUpdate = {
          name: employee.first_name + " " + employee.last_name,
        };
        return empUpdate;
      });

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's role would you like to update?",
            name: "empName",
            choices: arrayofNames,
          },
          {
            type: "list",
            message:
              "Which role do you want to assign to the selected employee?",
            name: "empRole",
            choices: arrayofRoles,
          },
        ])
        .then(({ empName, empRole }) => {
          connection.query(
            `UPDATE role
          INNER JOIN employee ON role.id = employee.role_id 
          SET title = ? WHERE concat(employee.first_name, " ", employee.last_name) = ?;`,
            [empRole, empName],
            (err) => {
              if (err) throw err;
              console.log("Employee role has been updated!");
              init();
            }
          );
        });
    });
  });
};

const init = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Departments",
        "Add Department",
        "View All Job Roles",
        "Add Job Role",
        "Exit",
      ],
    })
    .then(({ action }) => {
      console.log(action);
      switch (action) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "View All Job Roles":
          viewRoles();
          break;
        case "Add Job Role":
          addRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
};
