
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// ????????????????????????????????
const { choices } = require('yargs');

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
                        name: 'End',
                        value: 'end'
                    }
                ]
            }            
        ])
        .then( (answers) => {
            console.log(answers)
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
                    return updateEmp()
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
    'SELECT * FROM employees',
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
            console.log(empFirst, empLast, empRole, empMan);
            connection.query(
            'INSERT INTO employees SET ?',
                {first_name: empFirst, last_name: empLast, role_id: empRole, manager_id: empMan},
            function (err, res) {
                if (err) throw err;
            console.log(empFirst + ' ' + empLast + ' has been added as a new employee.');
            viewEmp();
            })
        })
}

function updateEmp() {
    console.log('Update An Employee Role:');

    // inquirer
    //     .prompt([
    //         {
    //             type: 'list',
    //             message: 'Which employee\'s role would you like to update?',
    //             choices: []
    //         },
    //         {
    //             type: 'list',

    //         }
    //     ]) 
    startPrompt();
}

startPrompt();