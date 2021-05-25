import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection();

  const id = uuidV4();
  const password = await hash("admin", 8);

  await connection.query(`
  INSERT INTO public.users
  (id, "name", "password", email, driver_license, "isAdmin", created_at, avatar)
  VALUES('${id}', 'admin', '${password}', 'kitocx@gmail.com', 'abc', true, NOW(), NULL);
  `);

  await connection.close();
}

create().then(() => console.log("User admin created"));
