
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'wzhw4te2',
        database: 'employeeDB'
    }
);

function startPrompt() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'opt',
                choices: [
                    {
                        name: 'View all departments',
                        value: 'viewDept'
                    },
                    {
                        name: 'View all roles',
                        value: 'viewRoles'
                    },
                    {
                        name: 'View all employees',
                        value: 'viewEmp'
                    },
                    {
                        name: 'Add a department',
                        value: 'addDept'
                    },
                    {
                        name: 'Add a role',
                        value: 'addRole'
                    },
                    {
                        name: 'Add an employee',
                        value: 'addEmp'
                    },
                    {
                        name: 'Update an employee role',
                        value: 'updateEmp'
                    },
                    {
                        name: 'View employees by deparment',
                        value: 'viewEmpDept'
                    },
                    {
                        name: 'View employees by manager',
                        value: 'viewEmpMan'
                    },
                    {
                        name: 'View departmental payroll expenses',
                        value: 'viewExp'
                    },
                    {
                        name: 'End',
                        value: 'end'
                    }
                ]
            }            
        ])
        .then( (answers) => {
            switch (answers.opt) {
                case "viewDept":
                    return viewDept()
                case "viewRoles":
                    return viewRoles()
                case "viewEmp":
                    return viewEmp()
                case "addDept":
                    return addDept()
                case "addRole":
                    return addRole()
                case "addEmp":
                    return addEmp()
                case "updateEmp":
                    return employeeList()
                case "viewEmpDept":
                    return viewEmpDept()
                case "viewEmpMan":
                    return viewEmpMan()
                case "viewExp":
                    return viewExp()
                case "end":
                    return
                default:
                    break;
    }})
}

function viewDept() {
    console.log('View All Departments:');
    connection.query(
    'SELECT * FROM departments',
    function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompt();
    });
}

function viewRoles() {
    console.log('View All Roles:');
    connection.query(
    'SELECT * FROM roles',
    function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompt();
    });
}

function viewEmp() {
    console.log('View All Employees:');
    connection.query(
    `SELECT e.first_name AS 'Employee First Name', e.last_name AS 'Employee Last Name', e.role_id AS 'Employee Role ID', e.manager_id AS 'Employee Manager ID', r.title AS 'Employee Title', r.salary AS 'Employee Salary', r.department_id AS 'Department ID' FROM employees e INNER JOIN roles r WHERE r.id = e.role_id`,
    function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompt();
    });
}

function addDept() {
    console.log('Add A Department:');
    inquirer
        .prompt ([
            {
                type: 'input',
                message: 'Enter new department name.',
                name: 'addDeptName', 
            }
        ])
        .then((data) => {
            var deptName = data.addDeptName;
            connection.query(
            'INSERT INTO departments SET ?',
                {name: deptName},
            function (err, res) {
                if (err) throw err;
            })
            console.log(deptName + ' has been added as a new department.');
            viewDept();
        })
}

function addRole() {
    console.log('Add A Role:');
    inquirer
        .prompt ([
            {
                type: 'input',
                message: 'Enter name of role.',
                name: 'addRoleName'
            },
            {
                type: 'input',
                message: 'Enter role salary.',
                name: 'addRoleSal'
            },
            {
                type: 'input',
                message: 'Enter department ID for this role.',
                name: 'addRoleDept',
            }
        ])
        .then((data) => {
            var roleName = data.addRoleName;
            var roleSal = data.addRoleSal;
            var roleDept = data.addRoleDept;
            connection.query(
            'INSERT INTO roles SET ?',
                {title: roleName, salary: roleSal, department_id: roleDept},
            function (err, res) {
                if (err) throw err;
            })
            console.log(roleName + ' has been added as a new role.');
            viewRoles();
        })
}

function addEmp() {
    console.log('Add An Employee:')
    inquirer
        .prompt ([
            {
                type: 'input',
                message: 'Enter employee first name.',
                name: 'addEmpFirst'
            },
            {
                type: 'input',
                message: 'Enter employee last name.',
                name: 'addEmpLast'
            },
            {
                type: 'input',
                message: 'Enter employee role.',
                name: 'addEmpRole'
            },
            {
                type: 'input',
                message: 'Enter employee manager.',
                name: 'addEmpMan'
            }
        ])
        .then((data) => {
            var empFirst = data.addEmpFirst;
            var empLast = data.addEmpLast;
            var empRole = data.addEmployeeRole;
            var empMan = data.addEmpMan;
            connection.query(
            `INSERT INTO employees SET ?`,
                {first_name: empFirst, last_name: empLast, role_id: empRole, manager_id: empMan},
            function (err, res) {
                if (err) throw err;
            console.log(empFirst + ' ' + empLast + ' has been added as a new employee.');
            viewEmp();
            })
        })
}
function employeeList() {
    connection.query(
    `SELECT * FROM employees`,
    function (err, res) {
        if (err) throw err;
        const employeeList = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`
        }));
        console.table(res);
        updateEmp(employeeList);    
    })
}

function updateEmp(employeeList) {
    console.log('Update An Employee Role:');
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which employee would you like to update?',
                name: 'updateEmpName',
                choices: employeeList
            },
            {
                type: 'input',
                message: 'What is the employee\'s new role id?',
                name: 'updateEmpRole'
            },
            {
                type: 'input',
                message: 'What is the employee\'s new salary?',
                name: 'updateEmpSal'
            }
        ])
        .then((data) => {
            var updatedName = data.updateEmpName;
            var updatedRole = data.updateEmpRole;
            var updatedSal = data.updateEmpSal;
            console.log(updatedName);
            connection.query(
            `UPDATE employees SET role_id = ${updatedRole} WHERE id = ${updatedName}`,
            `UPDATE roles SET salary = ${updatedSal} WHERE id = ${updatedRole}`,
            function (err, res) {
                if (err) throw err;
            viewEmp();
            })
    }) 
}

function viewEmpDept() {
    console.log('View Employees By Department:');
    connection.query(
    `SELECT d.id AS 'Department ID', d.name AS 'Department Name', r.title AS 'Employee Title', e.first_name AS 'First Name', e.last_name AS 'Last Name' FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON d.id = r.department_id`,
    function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompt();
    });
}

startPrompt();