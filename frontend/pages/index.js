import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')
    const router = useRouter()

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        if (!savedToken) {
            router.push('/login')
        } else {
            setToken(savedToken)
        }
    }, [router])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim()) return
        const userMessage = { role: 'user', content: input }
        setMessages([...messages, userMessage])
        setInput('')
        setLoading(true)

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { message: input }, { headers: { Authorization: `Bearer ${token}` } })
            const assistantMessage = { role: 'assistant', content: response.data.message }
            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
                <h2 className="text-2xl font-bold mb-8">Assistente AI</h2>
                <button onClick={() => setMessages([])} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4">Nova Conversa</button>
                <div className="flex-1"></div>
                <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Sair</button>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="bg-white border-b p-4 shadow">
                    <h1 className="text-xl font-bold text-gray-800">Chat com Assistente</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-xl">Comece uma conversa...</p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}> 
                            <div className={`max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 text-gray-800 rounded-bl-none'}`}> 
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none"> 
                                <p>Digitando...</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-white border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={loading} className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Digite sua mensagem..." />
                        <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}