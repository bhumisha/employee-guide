
const queries = 
{
    INSERT_DEPARTMENT : `INSERT INTO Department SET ? `,
    INSERT_ROLE : `INSERT INTO Role_Detail SET ?  `,
    INSERT_EMPLOYEE : `INSERT INTO Employee SET ?  `,

    RETRIEVE_DEPARTMENT : `SELECT * FROM Department
    ORDER BY id`,
    
    RETRIEVE_ROLE:`SELECT empRole.id as ID,department as Department,job_title as 'Job Title',salary  as Salary
    FROM Role_Detail empRole 
    LEFT JOIN Department ON empRole.department_id = Department.id 
    ORDER BY empRole.id`,
    
    RETRIEVE_EMPLOYEE:`SELECT emp.id as ID,emp.first_name as 'First Name',emp.last_name as 'Last Name',job_title as 'Job Title',salary as Salary,department as Department,
    CONCAT(emp1.first_name ,' ', emp1.last_name) as Manager
    FROM Employee emp 
    LEFT JOIN Employee emp1 ON emp.manager_id = emp1.id 
    INNER JOIN Role_Detail ON emp.role_id = Role_Detail.id
    INNER JOIN Department ON Role_Detail.department_id = Department.id`,


    RETRIEVE_EMPLOYEETABLE:`SELECT * FROM EMPLOYEE ORDER BY id`,
    RETRIEVE_ROLETABLE:`SELECT * FROM Role_Detail ORDER BY id`,

    DELETE_EMPLOYEE :`DELETE FROM Employee where id = ? `,
    DELETE_ROLE :`DELETE FROM Role_Detail where id = ? `,
    DELETE_DEPARTMENT :`DELETE FROM Department where id = ? `,

    RETRIEVE_BUDGET_QUERY:`select department,sum(salary) as budget from role_detail inner join department on role_detail.department_id = department.id group by department,department.id `
} 

module.exports = queries;