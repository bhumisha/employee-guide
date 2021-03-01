const connection = require('../db/database');
const inquirer = require('inquirer');
const queries = require('../db/queries');

require('console.table');


connection.connect(err => {
    if (err) throw err;  
    employeeGuide();

});

afterConnection = () => { 
    connection.end();
};



/**********************************Insert Block Start************************  */
const insertTextRowtoTable = (departmentObj,sqlQuery) => {
    
    const values =  departmentObj;
    connection.query(
        sqlQuery,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log("Record inserted in to the Database."); 
                employeeGuide();
        });
        
};  
/**********************************Insert Block End************************  */


/**********************************View / Retrieve Block Start************************  */
const retrieveSelectedTableData = (sqlQuery) => {
        
    connection.promise().query(sqlQuery)
        .then( ([rows,fields]) => {
                console.log("\n")
                console.table(rows);
                employeeGuide();        
        })
        .catch(console.log)
  };

const viewByDepartment = () => {
    let query = "SELECT * FROM Department ORDER BY id";
    connection.query(query, function(err, res) {
          if (err) throw err;

          let departmentList = res.map(item=>item.department);

          return inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'Which Department would you like to see?',
                choices:departmentList
            }
    
        ]).then(departmentObj =>{

            const department_id = departmentList.indexOf(departmentObj.department_id) + 1;
            const whereCluase = " WHERE Department.id= " + department_id;
            viewEmployeeWithWhereClause(whereCluase); 
        });
     
    });
    
};

const viewByManager = () => {
    let query = `SELECT distinct emp1.id, CONCAT(emp1.first_name ,' ', emp1.last_name) as manager
                 FROM Employee emp 
                 INNER JOIN Employee emp1 ON emp.manager_id = emp1.id`;
    connection.query(query, function(err, res) {
        if (err) throw err;

        let managerList = res.map(item=>item.manager);

        return inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which Manager would you like to see?',
                choices:managerList
            }

        ]).then(managerObj =>{

            const selectedManager = res.find(item => item.manager === managerObj.manager);
            console.log(selectedManager);
            const whereClause = " WHERE emp1.id = " + selectedManager.id;
            viewEmployeeWithWhereClause(whereClause); 
        });
     
    });
    
};

const viewEmployeeWithWhereClause = (param) => {
        const sql = `SELECT emp.id as ID,emp.first_name as 'First Name',emp.last_name as 'Last Name',job_title as 'Job Title',salary as Salary,department as Department,
        CONCAT(emp1.first_name ,' ', emp1.last_name) as Manager
        FROM Employee emp 
        LEFT JOIN Employee emp1 ON emp.manager_id = emp1.id
        INNER JOIN Role_Detail ON emp.role_id = Role_Detail.id
        INNER JOIN Department ON Role_Detail.department_id = Department.id `;

        const whereClause = param!=null ? param : "";
        const orderBy = ` ORDER BY  emp.id`
        const query = sql + whereClause + orderBy;
        connection.promise().query(query)
        .then( ([rows,fields]) => {
            console.log("\n")
            console.table(rows);
            employeeGuide();
        })
        .catch(console.log) 
};
const viewBudget = (sql , param) => {
    const whereClause = param!=null ? param : "";
    const query = sql + whereClause;
    connection.promise().query(query)
    .then( ([rows,fields]) => {
        console.log("\n")
        console.table(rows);
        employeeGuide();
    })
    .catch(console.log) 
};

/**********************************View / Retrieve Block End************************  */

/**********************************DML - Update / Delete Block Start ************************  */
const removeItemRowFromTable = (sql,values) => {
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' deleted sucessfully!\n'); 
                employeeGuide();
    });
};

const updateEmployeeRole = (parameter) => {
    const sql = "UPDATE Employee SET ? where ? ";
    const values = [{"role_id":parameter.role_id} ,{"id":parameter.id}];
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' employee updated sucessfully!\n'); 
                employeeGuide();
    });
}

const updateEmployeeManager = (parameter) => {
    const sql = "UPDATE Employee SET ? where ? ";
    const values = [{"manager_id":parameter.manager_id} ,{"id":parameter.id}];
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' employee updated sucessfully!\n'); 
                employeeGuide();
    });

}


/**********************************DML - Update / Delete Block End ************************  */
//This function is prompt for Department Data
const promtAddDepartment = () => {
    return inquirer.prompt([
    {
        type: 'input',
        name: 'department',
        message: "Enter Department.",
        validate: department => {
            if (department) {
                return true;
            } else {
                console.log('Please enter valid Deparment Name!');
                return false;
            }
            }
    }
    ]).then(
        departmentObj => {
            insertTextRowtoTable(departmentObj,queries.INSERT_DEPARTMENT);
    })
};
//This function is prompt for Role Data
const promptAddRole = () => {
    connection.query(
        queries.RETRIEVE_DEPARTMENT,
        function(err, res) {
          if (err) throw err;
          let departmentList = res.map(item=>item.department);
          return inquirer.prompt([
            {
                type: 'input',
                name: 'job_title',
                message: "Please enter Job Title?",
                validate: job_title => {
                    if (job_title) {
                        return true;
                    } else {
                        console.log('Please enter Job Title!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "Please enter Salary?",
                validate: salary => {
                    if (salary) {
                        return true;
                    } else {
                        console.log('Please enter Salary!');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Please select the Department for this job title?',
                choices:departmentList
            }
    
        ]).then(roleObj =>{
            const departmentObj = res.find(item => item.department=== roleObj.department_id);
            roleObj.department_id = departmentObj.id;
            insertTextRowtoTable(roleObj,queries.INSERT_ROLE); 
        });
     
    });
    
};

//This function is prompt for Employee Data
const promptAddEmployee = () => {
    let roleList = [];
    let employeeList = [];
    connection.query(queries.RETRIEVE_ROLETABLE, function(err, roleResponse) {
          if (err) throw err;
          roleList = roleResponse.map(item=>item.job_title);

          connection.query(queries.RETRIEVE_EMPLOYEETABLE,function(err, employeeResponse) {
              if (err) throw err;
               employeeList = employeeResponse.map(item=>item.first_name + ' ' + item.last_name);
               
               return inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "Please enter employee's first name",
                    validate: first_name => {
                        if (first_name) {
                            return true;
                        } else {
                            console.log("Please enter employee's first name");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "Please enter employee's last name",
                    validate: last_name => {
                        if (last_name) {
                            return true;
                        } else {
                            console.log("Please enter employee's last name");
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "Please select Role for an employee",
                    choices:roleList
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Please select Manager for an employee",
                    choices:employeeList
                }
            ]).then(employeeObj =>{
                const roleObj = roleResponse.find(item => item.job_title=== employeeObj.role_id);
                employeeObj.role_id = roleObj.id;

                const managerObj = employeeResponse.find(item => (item.first_name + ' ' + item.last_name)=== employeeObj.manager_id);
                employeeObj.manager_id = managerObj.id;
                
                console.log(employeeObj);
                insertTextRowtoTable(employeeObj,queries.INSERT_EMPLOYEE);
            }).catch(err =>{ throw err;})
    


        })
    })
};

const promptDeleteEmployee = () => {
        connection.query(
        queries.RETRIEVE_EMPLOYEETABLE, function(err, employeeResponse) {
            if (err) throw err;
            let employeeList = employeeResponse.map(item=>item.first_name + ' ' + item.last_name);

            return inquirer.prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: "Please select Manager for an employee",
                choices:employeeList
            }
            ]).then(employeeObj => {
                const objTobeDelete = employeeResponse.find(item => (item.first_name + ' ' + item.last_name)=== employeeObj.selectedEmployee);
                const param = objTobeDelete.id;
                removeItemRowFromTable(queries.DELETE_EMPLOYEE,param);
            })
    })
}

const promptDeleteDepartment = () => {
    connection.query(
        queries.RETRIEVE_DEPARTMENT,
        function(err, departmentRes) {
        if (err) throw err;
        let departmentList = departmentRes.map(item=>item.department);
        return inquirer.prompt([
        {
            type: 'list',
            name: 'selectedDepartment',
            message: "Please select the Department you want to delete",
            choices:departmentList
        }
        ]).then(answer => {
            const objTobeDelete = departmentRes.find(item => item.department === answer.selectedDepartment);
            const param = objTobeDelete.id;
            removeItemRowFromTable(queries.DELETE_DEPARTMENT,param);
        })
    })
}

const promptDeleteRole = () => {
    connection.query(
        queries.RETRIEVE_ROLETABLE,
        function(err, res) {
        if (err) throw err;
        let roleList = res.map(item=>item.job_title);
        return inquirer.prompt([
        {
            type: 'list',
            name: 'selectedRole',
            message: "Please select the Role you want to delete",
            choices:roleList
        }
        ]).then(answer => {
            const objTobeDelete = res.find(item => item.job_title === answer.selectedRole);
            const param = objTobeDelete.id;
            removeItemRowFromTable(queries.DELETE_ROLE,param);
        })
    })
}

const promptUpdateEmpRole = () => {
    let roleList = [];
    let employeeList = [];
    connection.query(
        queries.RETRIEVE_EMPLOYEETABLE,
            function(err, employeeResponse) {
              if (err) throw err;
               employeeList = employeeResponse.map(item=>item.first_name + ' ' + item.last_name);
                connection.query(
                    queries.RETRIEVE_ROLETABLE,
                    function(err, roleResponse) {
                    if (err) throw err;
                    roleList = roleResponse.map(item=>item.job_title);
    
                    return inquirer.prompt([ 
                        {
                            type: 'list',
                            name: 'employee',
                            message: "Select the employee you would like to update",
                            choices:employeeList
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: "Select the employee's updated role",
                            choices:roleList
                        }
                    ]).then(employeeObj =>{
                        const roleObj = roleResponse.find(item => item.job_title=== employeeObj.role);
                        employeeObj.role_id = roleObj.id;

                        const empObjForupdate = employeeResponse.find(item => (item.first_name + ' ' + item.last_name)=== employeeObj.employee);
                        employeeObj.id = empObjForupdate.id;
                        updateEmployeeRole(employeeObj);
                    }).catch(err =>{ throw err;})
                        


        })
    })
};

const promptUpdateEmpManager = () => {
    let employeeList = [];
    connection.query(
        "SELECT * FROM employee",
            function(err, employeeResponse) {
              if (err) throw err;
               employeeList = employeeResponse.map(item=>item.first_name + ' ' + item.last_name);
                    return inquirer.prompt([ 
                        {
                            type: 'list',
                            name: 'employee',
                            message: "Select the employee you would like to update",
                            choices:employeeList
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Select the employee's updated Manager",
                            choices:employeeList
                        }
                    ]).then(employeeObj =>{
                        const empObjForupdate = employeeResponse.find(item => (item.first_name + ' ' + item.last_name)=== employeeObj.employee);
                        employeeObj.id = empObjForupdate.id;

                        const empManagerObj = employeeResponse.find(item => (item.first_name + ' ' + item.last_name)=== employeeObj.manager);
                        employeeObj.manager_id = empManagerObj.id;

                        updateEmployeeManager(employeeObj);
                    }).catch(err =>{ throw err;})
                        


        })
};


const promptDepartmentForBudget = () => {
    connection.query(
        queries.RETRIEVE_DEPARTMENT,
        function(err, departmentRes) {
        if (err) throw err;
        let departmentList = departmentRes.map(item=>item.department);
        return inquirer.prompt([
        {
            type: 'list',
            name: 'selectedDepartment',
            message: "Please select the Department to check utilization of budget",
            choices:departmentList
        }
        ]).then(answer => {
            const objDepartment = departmentRes.find(item => item.department === answer.selectedDepartment);
            const param = "having department.id = " + objDepartment.id;
            viewBudget(queries.RETRIEVE_BUDGET_QUERY,param);
        })
    })
}
//This function is prompt for Employee to choose employee Role.
const menuOptionPrompt = () =>{
    return inquirer.prompt([
        {
            type: 'list',
            pageSize: 15,
            name: 'operation',
            message: "What would you like to do?",
            choices:['View All Employees',
                     'View All Employees by Department',
                     'View All Employees by Manager',
                     'View All Departments',
                     'View All Roles', 
                     'Add Employee',
                     'Add Role',
                     'Add Department',
                     'Delete Employee', 
                     'Delete Department', 
                     'Delete Role', 
                     'Update Employee Role',
                     'Update Employee Manager',
                     'Utilized budget of a Department',
                     'Exit'
                    ]
        }
    ]);
};

//This will help to build team and called recursive function.
const employeeGuide = () => {
    menuOptionPrompt()
    .then((response)=>{
        switch(response.operation){
            case "View All Employees": {
                retrieveSelectedTableData(queries.RETRIEVE_EMPLOYEE);
                break;
            }
            case "View All Employees by Department": {
                viewByDepartment();
                break;
            }
            case "View All Employees by Manager": {
                viewByManager();
                break;
            }
            case "View All Departments": {
                retrieveSelectedTableData(queries.RETRIEVE_DEPARTMENT);
                break;
            }
            case "View All Roles": {
                retrieveSelectedTableData(queries.RETRIEVE_ROLE);
                break;
            }
            case "Add Employee": {;
                promptAddEmployee()
                break;
            }
            case "Add Role": {
                promptAddRole();
                break;
            }
            case "Add Department": {
                promtAddDepartment();
                
                break;
            }
            case "Delete Employee": {
                promptDeleteEmployee();
                break;
            }
            case "Delete Department": {
                promptDeleteDepartment();
                break;
            }
            case "Delete Role": {
                promptDeleteRole();
                break;
            }
            
            case "Update Employee Role": {
                promptUpdateEmpRole();
                break;
            }
            case "Update Employee Manager": {
                promptUpdateEmpManager();
                break;
            }
            case "Utilized budget of a Department": {
                promptDepartmentForBudget();
                break;
            }

            
            case "Exit":{
                afterConnection();
                break;
            }
        }
       
       
    })
    .catch(err => {
        console.log(err);
    });     
}
