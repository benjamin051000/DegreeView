import fs from 'fs';
const fsPromises = fs.promises;
/**
 * Helper function that adds a major's 
 * requirements to the database.
 */
const addData = async function () {
  let data = await fs.promises.readFile('./server/majors.json');
  let json = await JSON.parse(data);

  for (var majorName in json) {
    let courses = json[majorName]["core"];
    console.log(courses);
    const db_res = db.collection('majors').doc(majorName).set({ "core": courses });
  }
}
// TODO remove, this is just a helper function to add stuff to DB
// and is not part of production
// // addData();