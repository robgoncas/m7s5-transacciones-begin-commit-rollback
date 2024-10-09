-- Ejemplo de archivo completo:

-- 1. Tabla productos
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL
);

-- 2. Tabla ventas
CREATE TABLE ventas (
    id_venta SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_venta TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- 3. Tabla inventario
CREATE TABLE inventario (
    id_inventario SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL UNIQUE,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- 4. Tabla estudiantes
CREATE TABLE estudiantes (
    id_estudiante SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. Tabla cursos
CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    inscritos INTEGER NOT NULL DEFAULT 0 CHECK (inscritos >= 0)
);

-- 6. Tabla cursos_estudiantes
CREATE TABLE cursos_estudiantes (
    id SERIAL PRIMARY KEY,
    id_curso INTEGER NOT NULL,
    id_estudiante INTEGER NOT NULL,
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso),
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
    UNIQUE (id_curso, id_estudiante)
);

-- 7. Tabla pedidos
CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Pendiente', 'Pagado', 'Cancelado')),
    fecha_pedido TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_pago TIMESTAMP
);

-- 8. Tabla pagos
CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
    metodo VARCHAR(50) NOT NULL,
    fecha_pago TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);
