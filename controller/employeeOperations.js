const connection = require('../db/database');
const inquirer = require('inquirer');


const employeeList = [];

  connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
   // getEmployeeArray();
    employeeGuide(); 
   
  });
  
  afterConnection = () => { 
    connection.end();
  };
  

getEmployeeArray = () => {
    connection.promise().query("SELECT * FROM Employee")
    .then( ([rows,fields]) => {
            console.log("\n")
            console.table(rows);
            employeeList.push(rows);
    })
}
/**********************************Insert Block Start************************  */
const addDepartment = (departmentObj) => {
    const sql = "INSERT INTO Department SET ? ";
    const values =  departmentObj;
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' department inserted sucessfully!\n'); 
                employeeGuide();
        });
        
};  

const addEmployeeRole = (roleObj) => {
    const sql = "INSERT INTO Role_Detail SET ? ";
    const values = roleObj;//{ departmentId:roleOb, job_title, salaryj};
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' employee role inserted sucessfully!\n'); 
                employeeGuide();
        });

};  

const addEmployee = (employeeObj) => {
    const sql = "INSERT INTO Employee SET ? ";
    const values = employeeObj;//{ departmentId:roleOb, job_title, salaryj};
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' employee inserted sucessfully!\n'); 
                employeeGuide();
    });
};

/**********************************Insert Block End************************  */


/**********************************View / Retrieve Block Start************************  */
const viewDepartment = () => {
    // .then( ([rows,fields]) => {
        connection.query(("SELECT * FROM Department"),(err,res)=>{
                console.log("\n")
                console.table(res);
                employeeGuide();
          
        });
  };

const viewRole = () => {
    const sql = "SELECT empRole.id,department,job_title,salary FROM Role_Detail empRole LEFT JOIN Department ON empRole.department_id = Department.id"
    connection.promise().query(sql)
    .then( ([rows,fields]) => {
            console.log("\n")
            console.table(rows);
            employeeGuide();        
    })
    .catch(console.log)
};

const viewEmployee = () => {
    
    const query = `SELECT emp.id,emp.first_name,emp.last_name,job_title,salary,department,
                CONCAT(emp1.first_name ,' ', emp1.last_name) as Manager
                FROM Employee emp 
                LEFT JOIN Employee emp1 ON emp.manager_id = emp1.id
                INNER JOIN Role_Detail ON emp.role_id = Role_Detail.id
                INNER JOIN Department ON Role_Detail.department_id = Department.id
                ` 
                connection.promise().query(query)
                .then( ([rows,fields]) => {
                  console.log("\n")
                  console.table(rows);
                  employeeGuide();
                })
                .catch(console.log)
        
};
const viewByDepartment = () => {
    let query = "SELECT department FROM Department ORDER BY id";
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
    let query = `SELECT emp1.id, CONCAT(emp1.first_name ,' ', emp1.last_name) as manager
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
        const sql = `SELECT emp.id,emp.first_name,emp.last_name,job_title,salary,department,
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
        addDepartment(departmentObj);
    })
};
//This function is prompt for Role Data
const promptAddRole = () => {
    connection.query(
        "SELECT * FROM Department",
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
                message: 'Please select Department?',
                choices:departmentList
            }
    
        ]).then(roleObj =>{
            const departmentObj = res.find(item => item.department=== roleObj.department_id);
            roleObj.department_id = departmentObj.id;
            addEmployeeRole(roleObj); 
        });
     
    });
    
};

//This function is prompt for Employee Data
const promptAddEmployee = () => {
    let roleList = [];
    let employeeList = [];
    connection.query(
        "SELECT * FROM Role_Detail",
        function(err, roleResponse) {
          if (err) throw err;
          roleList = roleResponse.map(item=>item.job_title);
          connection.query(
            "SELECT * FROM employee",
            function(err, employeeResponse) {
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
                addEmployee(employeeObj);
            }).catch(err =>{ throw err;})
    


        })
    })
};

const promptDeleteEmployee = () => {
        connection.query(
            "SELECT * FROM employee",
            function(err, employeeResponse) {
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
            const query = "DELETE FROM Employee where id = ? "
            const param = objTobeDelete.id;
            removeItemRowFromTable(query,param);
        })
    })
}

const promptDeleteDepartment = () => {
    connection.query(
        "SELECT * FROM Department order by id",
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
            const query = "DELETE FROM Department where id = ? "
            const param = objTobeDelete.id;
            removeItemRowFromTable(query,param);
        })
    })
}

const promptDeleteRole = () => {
    connection.query(
        "SELECT * FROM Role_Detail order by id",
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
            const query = "DELETE FROM Role_Detail where id = ? "
            const param = objTobeDelete.id;
            removeItemRowFromTable(query,param);
        })
    })
}

const promptUpdateEmpRole = () => {
    let roleList = [];
    let employeeList = [];
    connection.query(
        "SELECT * FROM employee",
            function(err, employeeResponse) {
              if (err) throw err;
               employeeList = employeeResponse.map(item=>item.first_name + ' ' + item.last_name);
                connection.query(
                    "SELECT * FROM Role_Detail",
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
//This function is prompt for Employee to choose employee Role.
const menuOptionPrompt = () =>{
    return inquirer.prompt([
        {
            type: 'list',
            pageSize: 13,
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
                     'Exit'
                    ]
        }
    ]);
};

//This will help to build team and called recursive function.
const employeeGuide = () => {
    menuOptionPrompt()
    .then((response)=>{
        console.log(response);
        switch(response.operation){
            case "View All Employees": {
                viewEmployee();
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
                viewDepartment();
                break;
            }
            case "View All Roles": {
                viewRole();
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
