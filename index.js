const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config(); 

// Create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'cmsDB'
  });
  
  connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    employeeGuide(); 
  });
  
  afterConnection = () => { 
    // connection.query("select * from products",(err,res) => {
    //   if (err) throw err;
    //   console.log(res);
    // })
    connection.end();
  };
  

addDepartment = (departmentObj) => {
    console.log("Add Department Detail");
    const sql = "INSERT INTO department_detail SET ? ";
    const values =  departmentObj;
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' department inserted sucessfully!\n'); 
        });

};  

addEmployeeRole = (roleObj) => {
    console.log("Add Employee Role Detail");
    const sql = "INSERT INTO employeeRole SET ? ";
    const values = roleObj;//{ departmentId:roleOb, job_title, salaryj};
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' employee role inserted sucessfully!\n'); 
        });

};  

addEmployee = (employeeObj) => {
    console.log('Add Employee s\n');
    const sql = "INSERT INTO employee SET ? ";
    const values = employeeObj;//{ departmentId:roleOb, job_title, salaryj};
    connection.query(
        sql,
        values,
        (err,res)=> {
                if(err) throw err;
                console.log(res.affectedRows + ' employee inserted sucessfully!\n'); 
    });
};

viewDepartment = () => {
      connection.query("SELECT * FROM department_detail",(err,res) => {
          if(err) throw err;
          console.log(res);
      })
  };

viewRole = () => {
    const sql = "SELECT empRole.id,department,job_title,salary FROM employeeRole empRole LEFT JOIN department_detail ON empRole.departmentId = department_detail.id"
    connection.query(sql,(err,res) => {
        if(err) throw err;
        console.log(res);
    })
};

viewEmployee = () => {
    console.log("Employee List ");
    const sql = `SELECT emp.id,emp.first_name,emp.last_name,job_title,salary,department,
                CONCAT(emp1.first_name ,' ', emp1.last_name) as Manager
                FROM employee emp 
                LEFT JOIN employee emp1 ON emp.reporting_to_id = emp1.id
                INNER JOIN employeeRole ON emp.roleId = employeeRole.id
                INNER JOIN department_detail ON employeeRole.departmentId = department_detail.id
                ORDER BY  emp.id`
           
                connection.promise().query(sql)
                .then( ([rows,fields]) => {
                  console.table(rows);
                })
        //         connection.promise().query(sql,(err,res) => {
        // if(err) throw err;
        // console.log(res);
  //  })
};

viewEmployeeByDepartment = () => {
    const sql = `SELECT emp.id,emp.first_name,emp.last_name,department
                FROM employee emp 
                INNER JOIN employeeRole ON emp.roleId = employeeRole.id
                INNER JOIN department_detail ON employeeRole.departmentId = department_detail.id
                ORDER BY  emp.id`
    connection.query(sql,(err,res) => {
        if(err) throw err;
        console.log(res);
    })
};

viewEmployeeByManager = () => {
    const sql = `SELECT emp.id,emp.first_name,emp.last_name,
                 CONCAT(emp1.first_name ,' ', emp1.last_name) as Manager
                 FROM employee emp 
                 LEFT JOIN employee emp1 ON emp.reporting_to_id = emp1.id
                 ORDER BY  emp.id`
    connection.promise().query(sql,(err,res) => {
        if(err) throw err;
        console.log(res);
    })
};

const teamDetail = [];

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
                     'Remove Employee', 
                     'Update Employee Role',
                     'Update Employee Manager',
                     'Exit'
                    ]
        }
    ]);
};


//This function is prompt for Employee Data - Super constructor call.
const promtSuperEmployee = (employeeRole) => {
    return inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: `What is the team ${employeeRole}\'s name?`,
        validate: name => {
            if (name) {
                return true;
            } else {
                console.log(`Please enter ${employeeRole}\'s name?!`);
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'employeeId',
        message: `What is the team ${employeeRole}\'s Id?`,
        validate: employeeId => {
            if (employeeId) {
                return true;
            } else {
                console.log(`Please enter team ${employeeRole}\'s Id?!`);
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'email',
        message: `What is the team ${employeeRole}\'s email?`,
        validate: email => {
            if (email) {
                return true;
            } else {
                console.log(`Please enter team ${employeeRole}\'s email!`);
                return false;
            }
        }
    }
    ])
};

//This function is prompt for Manager Data
const promtManager = () => {
    return inquirer.prompt([
    {
        type: 'input',
        name: 'officeNumber',
        message: "what is the team manager's Office Number?",
        validate: officeNumber => {
            if (officeNumber) {
                return true;
            } else {
                console.log('Please enter team manager\'s Office Number!');
                return false;
            }
            }
    }
    ])
};
//This function is prompt for Engineer Data
const promptEngineer = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'githubUsername',
            message: "what is your engineer's GitHub username?",
            validate: githubUsername => {
                if (githubUsername) {
                    return true;
                } else {
                    console.log('Please enter your engineer\'s GitHub usernam!');
                    return false;
                }
                }
        }
    ])
    
};

//This function is prompt for Intern Data
const promptIntern = () => {
return inquirer.prompt([
        {
        type: 'input',
        name: 'school',
        message: "what is your intern's school?",
        validate: school => {
            if (school) {
                return true;
            } else {
                console.log('Please enter your intern\'s school');
                return false;
            }
            }
        }
    ])
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
                viewEmployeeByDepartment();
                break;
            }
            case "View All Employees by Manager": {
                viewEmployeeByManager();
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
            case "Add Employee": {
                promptIntern().then(schoolData => {
                    const internObj = new Intern(data.name,data.employeeId,data.email,schoolData.school,employeeRole.role);
                    teamDetail.push(internObj);
                    return buildTeam();
                })
                break;
            }
            case "Add Role": {
                promptIntern().then(schoolData => {
                    const internObj = new Intern(data.name,data.employeeId,data.email,schoolData.school,employeeRole.role);
                    teamDetail.push(internObj);
                    return buildTeam();
                })
                break;
            }
            case "Add Department": {
                promptIntern().then(schoolData => {
                    const internObj = new Intern(data.name,data.employeeId,data.email,schoolData.school,employeeRole.role);
                    teamDetail.push(internObj);
                    return buildTeam();
                })
                break;
            }
            case "Remove Employee": {
                promptIntern().then(schoolData => {
                    const internObj = new Intern(data.name,data.employeeId,data.email,schoolData.school,employeeRole.role);
                    teamDetail.push(internObj);
                    return buildTeam();
                })
                break;
            }
            case "Update Employee Role": {
                promptIntern().then(schoolData => {
                    const internObj = new Intern(data.name,data.employeeId,data.email,schoolData.school,employeeRole.role);
                    teamDetail.push(internObj);
                    return buildTeam();
                })
                break;
            }
            case "Update Employee Manager": {
                promptIntern().then(schoolData => {
                    const internObj = new Intern(data.name,data.employeeId,data.email,schoolData.school,employeeRole.role);
                    teamDetail.push(internObj);
                    return buildTeam();
                })
                break;
            }
        }
        return employeeGuide();
       
    })
    .catch(err => {
        console.log(err);
    });     
}

console.log("Please build your team!!\n")

// Function call to initialize app
 
