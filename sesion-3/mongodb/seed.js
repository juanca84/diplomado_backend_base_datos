use taskflow

db.users.drop()
db.projects.drop()
db.tasks.drop()

db.users.insertMany([
  {
    _id: 1,
    name: "Juan",
    email: "juan@taskflow.com"
  },
  {
    _id: 2,
    name: "Maria",
    email: "maria@taskflow.com"
  },
  {
    _id: 3,
    name: "Pedro",
    email: "pedro@taskflow.com"
  },
  {
    _id: 4,
    name: "Ana",
    email: "ana@taskflow.com"
  },
  {
    _id: 5,
    name: "Luis",
    email: "luis@taskflow.com"
  }
])

db.projects.insertMany([
  {
    _id: 1,
    name: "Backend API",
    description: "Desarrollo de API REST"
  },
  {
    _id: 2,
    name: "QA Platform",
    description: "Plataforma para pruebas"
  },
  {
    _id: 3,
    name: "Mobile App",
    description: "Aplicación móvil"
  }
])

db.tasks.insertMany([
  {
    _id: 1,
    title: "Crear API de usuarios",
    status: "pending",
    priority: "high",
    estimatedHours: 6,
    userId: 1,
    projectId: 1,
    createdAt: ISODate("2026-09-01T09:00:00Z"),
    tags: ["backend", "api"]
  },
  {
    _id: 2,
    title: "Diseñar base de datos",
    status: "completed",
    priority: "high",
    estimatedHours: 5,
    userId: 2,
    projectId: 1,
    createdAt: ISODate("2026-09-02T10:00:00Z"),
    tags: ["database", "postgresql"]
  },
  {
    _id: 3,
    title: "Crear autenticación",
    status: "in_progress",
    priority: "high",
    estimatedHours: 8,
    userId: 1,
    projectId: 1,
    createdAt: ISODate("2026-09-03T11:00:00Z"),
    tags: ["backend", "security"]
  },
  {
    _id: 4,
    title: "Crear pruebas unitarias",
    status: "pending",
    priority: "medium",
    estimatedHours: 4,
    userId: 3,
    projectId: 2,
    createdAt: ISODate("2026-09-04T12:00:00Z"),
    tags: ["testing", "qa"]
  },
  {
    _id: 5,
    title: "Pruebas de API",
    status: "completed",
    priority: "medium",
    estimatedHours: 3,
    userId: 2,
    projectId: 2,
    createdAt: ISODate("2026-09-05T13:00:00Z"),
    tags: ["testing", "api"]
  },
  {
    _id: 6,
    title: "Diseñar interfaz",
    status: "pending",
    priority: "low",
    estimatedHours: 7,
    userId: 4,
    projectId: 3,
    createdAt: ISODate("2026-09-06T14:00:00Z"),
    tags: ["frontend", "design"]
  },
  {
    _id: 7,
    title: "Documentar API",
    status: "pending",
    priority: "medium",
    estimatedHours: 3,
    userId: 1,
    projectId: 1,
    createdAt: ISODate("2026-09-07T15:00:00Z"),
    tags: ["documentation", "api"]
  },
  {
    _id: 8,
    title: "Configurar CI/CD",
    status: "in_progress",
    priority: "high",
    estimatedHours: 5,
    userId: 3,
    projectId: 1,
    createdAt: ISODate("2026-09-08T16:00:00Z"),
    tags: ["devops", "backend"]
  },
  {
    _id: 9,
    title: "Revisar seguridad",
    status: "pending",
    priority: "high",
    estimatedHours: 4,
    userId: 2,
    projectId: 1,
    createdAt: ISODate("2026-09-09T17:00:00Z"),
    tags: ["security", "backend"]
  },
  {
    _id: 10,
    title: "Preparar despliegue",
    status: "completed",
    priority: "high",
    estimatedHours: 6,
    userId: 3,
    projectId: 1,
    createdAt: ISODate("2026-09-10T18:00:00Z"),
    tags: ["devops", "deployment"]
  }
])

// Consultas MongoDB para comprobar
db.tasks.find()

db.tasks.find({
  status: "pending"
})

db.tasks.find({
  status: "pending",
  priority: "high"
})

db.tasks.find({
  estimatedHours: {
    $gt: 5
  }
})

db.tasks.find(
  {
    status: "pending"
  },
  {
    title: 1,
    priority: 1
  }
)

db.tasks.find()
  .sort({
    createdAt: -1
  })
  .limit(5)

db.tasks.find({
  tags: "backend"
})


// Consulta de actualización
db.tasks.updateOne(
  {
    _id: 1
  },
  {
    $set: {
      status: "completed"
    }
  }
)

// Comprobar:
db.tasks.find({
  _id: 1
})

// Consulta de eliminación
// Creamos uin registro
db.tasks.insertOne({
  _id: 99,
  title: "Tarea temporal",
  status: "pending",
  priority: "low"
})

// Eliminamos el registro
db.tasks.deleteOne({
  _id: 99
})  