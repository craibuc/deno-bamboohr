export class BambooHr {

    private authorization: string;
    public base_uri: string;

    constructor (subdomain: string, access_token: string) {
        this.authorization = `Basic ${btoa(`${access_token}:password`)}`;
        this.base_uri = `https://api.bamboohr.com/api/gateway.php/${subdomain}`;
    }
    
//#region employee

    get_employees = async (
        fields: Array<string> = ["firstName", "lastName", "status", "employeeNumber"],
      ) => {
      
        console.log("fields", fields);
      
        const url =`${this.base_uri}/v1/reports/custom?format=json`;
        console.log("url", url);
      
        const body = {
            fields: fields,
        };

        return await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) => content.employees);
    }

    get_employee = async (
        employee_id: number,
        fields: Array<string> = ["firstName", "lastName", "status", "employeeNumber"],
      ) => {
      
        console.log("employee_id", employee_id);
        console.log("fields", fields);
      
        const url = fields.length>0 ? `${this.base_uri}/v1/employees/${employee_id}?fields=${ fields.join(',') }` : `${this.base_uri}/v1/employees/${id}`;
        console.log("url", url);

        return await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) => content);
    }

    create_employee = async (
        data: object
    ) => {
        console.log("data", data);
      
        return await fetch(`${this.base_uri}/v1/employees`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
                "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.headers;
        })
        .then((headers) => {
            console.log("headers", headers);
            return {
                id: headers.get("Location").split('/').pop(),
                location: headers.get("Location"),
            }
        });

    }
    
    update_employee = async (
        employee_id: number,
        data: object,
    ) => {
        console.log("employee_id", employee_id);
        console.log("data", data);
            
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response;
        })
        .then(() => {
            return {
                id: employee_id,
                location: `${this.base_uri}/v1/employees/${ employee_id }`,
            };
        });

    }

//#endregion

//#region employee tables

    get_employee_table = async (
        employee_id: number,
        table_name: string
    ) => {
        
        console.log("employee_id", employee_id);
        console.log("table_name", table_name);
      
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}/tables/${table_name}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) => content);

    }

    add_employee_table_row = async (
        employee_id: number,
        table_name: string,
        body: object
    ) => {
      
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}/tables/${table_name}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) => content);

    }

    update_employee_table_row = async (
        employee_id: number,
        table_name: string,
        row_id: number,
        body: object
    ) => {
      
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}/tables/${table_name}/${row_id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) => content);

    }
    
    terminate_employee = async (
        employee_id: number,
        date: string,
        type: string,
        reason: string,
        rehire: string,
        comment: string,
    ) => {

        console.log("employee_id", employee_id);
        console.log("date", date);
        console.log("type", type);
        console.log("reason", reason);
        console.log("rehire", rehire);
        console.log("comment", comment);
      
        const data = {
          "date": date,
          "employmentStatus": "Terminated",
          "terminationTypeId": type === 'Involuntary' ? 'Termination (Involuntary)' : type === 'Voluntary' ? 'Resignation (Voluntary)' : type,
          "terminationReasonId": reason,
          "terminationRehireId": rehire,
          "comment": comment,
        };
        console.log("data", data);
      
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}/tables/employmentStatus`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response;
        });
        // .then((content) => content);

    }

//#endregion

//#region employee files

    get_employee_files = async (
        employee_id: number,
    ) => {
      
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}/files/view`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((data) => data.categories.filter((c) => c.files.length > 0));
    }

    upload_employee_file = async (
        employee_id: number,
        category_id: number, // the folder's id
        file_path: string, // the file to upload
        share: boolean, // make the file available to the employee [yes|no]
    ) => {
        console.log("employee_id", employee_id);
        console.log("category_id", category_id);
        console.log("file_path", file_path);
        console.log("share", share);
      
        const file_name = file_path.split("/").pop();
        console.log("file_name", file_name);
      
        const file_content = await Deno.readFile(file_path);
      
        const formData = new FormData();
        formData.append("file", new Blob([file_content]), file_name);
        formData.append("fileName", file_name);
        formData.append("category", category_id.toString());
        formData.append("share", share ? "yes" : "no");
      
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}/files`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
              // console.log("response", response);
                const error_message = response.headers.get("x-bamboohr-error-message");
                throw new Error(
                    `${response.statusText} [${response.status}] - ${error_message}`,
                );
            }
            return response.headers;
        })
        .then((headers) => {
            console.log("headers", headers);
            return {
                Location: headers.get("Location"),
            };
        });
      
    }

//#endregion

//#region employee photograph

    get_employee_photo = async (
        employee_id: number,
        size: 'original' | 'large' | 'medium' | 'small' | 'xs' | 'tiny' = 'original'
    ) => {
      
        return await fetch(`${this.base_uri}/v1/employees/${employee_id}/photo/${size}`, {
            method: "GET",
            headers: {
                Authorization: this.authorization,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.arrayBuffer();
        })
        .then((buffer) => new Uint8Array(buffer));
    }

    upload_employee_photo = async (
        employee_id: number,
        file_path: string,
    ) => {
    
        console.log("employee_id", employee_id);
        console.log("file_path", file_path);
      
        const file_name = file_path.split("/").pop();
        console.log("file_name", file_name);
      
        const file_content = await Deno.readFile(file_path);
      
        const formData = new FormData();
        formData.append("file", new Blob([file_content]), file_name);
      
        return fetch(`${this.base_uri}/v1/employees/${employee_id}/photo`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(`${response.statusText} [${response.status}]`);
            }
            return `${response.statusText} [${response.status}]`;
        });

    }

//#endregion

//#region meta

    get_fields = async (
    ) => {
      
        return await fetch(`${this.base_uri}/v1/meta/fields`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) => content);

    }

    get_tables = async (
    ) => {
    
        return await fetch(`${this.base_uri}/v1/meta/tables`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) => content);

    }

    get_file_categories = async (
    ) => {
      
        return await fetch(`${this.base_uri}/v1/employees/1/files/view`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: this.authorization,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((content) =>
            content.categories.map((category) => ({
                id: category.id,
                name: category.name,
            }))
        );

    }

//#endregion

}