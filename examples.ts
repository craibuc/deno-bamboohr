import { load } from "https://deno.land/std@0.222.1/dotenv/mod.ts";
const env = await load();

import { BambooHr } from "./mod.ts";

try {

    const bamboohr = new BambooHr(env.BAMBOOHR_SUBDOMAIN, env.BAMBOOHR_ACCESS_TOKEN);

    const fields = await bamboohr.get_fields();
    console.log('fields',fields);

    const tables = await bamboohr.get_tables();
    console.log('tables',tables);

    const file_categories = await bamboohr.get_file_categories();
    console.log('file_categories',file_categories);

    const employees = await bamboohr.get_employees();
    console.log('employees',employees);

    const employee = await bamboohr.get_employee(563);
    console.log('employee',employee);

    const photo = await bamboohr.get_employee_photo(563);
    console.log('photo',photo);

} catch (error) {
    console.log(error.message)
}
