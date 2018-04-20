# sections in Graphql:
  - Declarations types
  - Resolvers 
  - Queries
  
# Declarations types
  Separate Type == description for reading and 
           TypeInput == for writing data
  Issue with <Enum>: when pass by parameter in client function
  use String  
  or use whole Type not remote fields parameter
  
  ###example: create(a_id, zones: Zones, inputData) 
  - => create(a_id, zones: String, inputData)
  - => create(a_id, inputData+(zones: Zones))
  
  
# Resolvers :
  in the resolvers there is 2 parts :
  - controller with all verifactions
  - executor of queries
  
  ### Controller
  We check and valid fields before sending to the queries
  If errors -> throw new Error to the client 
  Controller looks like 400 error in REST api
  because errors come from client 
  
  ### Executor
  Call the queries with native api of your database
  If errors it's not necessary -> throw new Error to the client
  Emit error server side is better
  Executor looks like 500 error in REST api
  because errors come from server / DB
  
  ### Logs & Events 
  .... todo
  
  