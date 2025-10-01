require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000

// Healthcheck
app.get('/health', (req, res) => {
	res.json({ status: 'ok', time: new Date().toISOString() })
})

// Создать пост
app.post('/posts', async (req, res) => {
	try {
		const { title, content } = req.body
		if (!title || !content) {
			return res.status(400).json({ error: 'title и content обязательны' })
		}

		const result = await db.query(
			`INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *`,
			[title, content]
		)
		res.status(201).json(result.rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
})

// Получить все посты
app.get('/posts', async (req, res) => {
	try {
		const result = await db.query(`SELECT * FROM posts ORDER BY id DESC`)
		res.json(result.rows)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
})

// Получить один пост
app.get('/posts/:id', async (req, res) => {
	try {
		const { id } = req.params
		const result = await db.query(`SELECT * FROM posts WHERE id = $1`, [id])
		if (result.rowCount === 0)
			return res.status(404).json({ error: 'Не найдено' })
		res.json(result.rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
})

// Обновить пост (частично)
app.put('/posts/:id', async (req, res) => {
	try {
		const { id } = req.params
		const { title, content } = req.body
		if (!title && !content) {
			return res
				.status(400)
				.json({ error: 'Нужно передать title и/или content' })
		}

		// Получаем текущие значения
		const curr = await db.query(`SELECT * FROM posts WHERE id = $1`, [id])
		if (curr.rowCount === 0)
			return res.status(404).json({ error: 'Не найдено' })

		const newTitle = title ?? curr.rows[0].title
		const newContent = content ?? curr.rows[0].content

		const result = await db.query(
			`UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
			[newTitle, newContent, id]
		)

		res.json(result.rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
})

// Удалить пост
app.delete('/posts/:id', async (req, res) => {
	try {
		const { id } = req.params
		const result = await db.query(
			`DELETE FROM posts WHERE id = $1 RETURNING id`,
			[id]
		)
		if (result.rowCount === 0)
			return res.status(404).json({ error: 'Не найдено' })
		res.json({ deleted: result.rows[0].id })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
})

app.listen(PORT, () => {
	console.log(`API listening on http://0.0.0.0:${PORT}`)
})
