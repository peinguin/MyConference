exports.models = {
    "User":{
        "id":"User",
        "properties":{
            "id":{
                "type":"int"
            },
            "email":{
                "type":"string"
            },
            "password":{
                "type":"string"
            }
        }
    },
    "Conference":{
        id:"Conference",
        "properties":{
            "id":{
                "type":"int"
            },
            "name":{
                "type":"string"
            },
        }
    },
    "Decision":{
        id:"Decision",
        "properties":{
            "decision":{
                "type":"string",
                "enum": [
                    "go",
                    "not go",
                    "favorite"
                ]
            }
        }
    }
  }