import { defineDb,defineTable,column } from 'astro:db';


const Users = defineTable({
  columns:{
    id:column.number({primaryKey:true}),
    user_name: column.text({unique:true}),
    user_last_name : column.text(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {Users}
});
