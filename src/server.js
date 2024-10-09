const express = require('express');
const pg = require('pg');
const { Pool } = pg;

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_modulo7',
    password: '1234',
    port: 5432
});

//Endpoint 1: Vender un producto y actualizar el inventario
app.post('/vender-producto', async (req, res) => {
  //Valores por defecto
const { id_producto, cantidad } = Object.keys(req.body).length !== 0 ? req.body : { id_producto: 101, cantidad: 2 };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    //Registrar la venta
    const ventaQuery = 'INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES ($1, $2, NOW())';
    await client.query(ventaQuery, [id_producto, cantidad]);

    //Actualizar el inventario
    const inventarioQuery = 'UPDATE inventario SET stock = stock - $1 WHERE id_producto = $2';
    await client.query(inventarioQuery, [cantidad, id_producto]);

    await client.query('COMMIT');
    res.status(200).send('Venta registrada y stock actualizado');
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).send('Error en la transacción: ' + e.message);
  }
});

//Endpoint 2: Inscribir a un alumno en un curso
app.post('/inscribir-alumno', async (req, res) => {
  const { nombre, email, id_curso } = req.body || { nombre: 'Ana López', email: 'ana.lopez@ejemplo.com', id_curso: 202 }; //Valores por defecto

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    //Insertar el nuevo alumno
    const alumnoQuery = 'INSERT INTO estudiantes (nombre, email, fecha_inscripcion) VALUES ($1, $2, NOW()) RETURNING id_estudiante';
    const alumnoRes = await client.query(alumnoQuery, [nombre, email]);

    //Asignar al alumno al curso
    const cursoQuery = 'INSERT INTO cursos_estudiantes (id_curso, id_estudiante) VALUES ($1, $2)';
    await client.query(cursoQuery, [id_curso, alumnoRes.rows[0].id_estudiante]);

    //Actualizar el contador de inscritos en el curso
    const actualizarCursoQuery = 'UPDATE cursos SET inscritos = inscritos + 1 WHERE id_curso = $1';
    await client.query(actualizarCursoQuery, [id_curso]);

    await client.query('COMMIT');
    res.status(200).send('Alumno inscrito correctamente');
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).send('Error en la transacción: ' + e.message);
  }
});

//Endpoint 3: Registrar un pedido y su pago en un restaurante
app.post('/pago-pedido', async (req, res) => {
  const { id_pedido, monto, metodo } = req.body || { id_pedido: 303, monto: 45.00, metodo: 'Tarjeta de Crédito' }; //Valores por defecto

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    //Insertar un nuevo pedido en estado 'Pendiente'
    const pedidoQuery = 'INSERT INTO pedidos (id_pedido, estado, fecha_pedido) VALUES ($1, $2, NOW())';
    await client.query(pedidoQuery, [id_pedido, 'Pendiente']);

    //Actualizar el estado del pedido a 'Pagado'
    const actualizarPedidoQuery = 'UPDATE pedidos SET estado = $1, fecha_pago = NOW() WHERE id_pedido = $2';
    await client.query(actualizarPedidoQuery, ['Pagado', id_pedido]);

    //Registrar el pago
    const pagoQuery = 'INSERT INTO pagos (id_pedido, monto, metodo, fecha_pago) VALUES ($1, $2, $3, NOW())';
    await client.query(pagoQuery, [id_pedido, monto, metodo]);

    await client.query('COMMIT');
    res.status(200).send('Pedido y pago registrados correctamente');
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).send('Error en la transacción: ' + e.message);
  }
});

//Configurar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
