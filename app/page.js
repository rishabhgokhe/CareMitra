import { createClient } from './../utils/supabase/client';

export default async function Home() {
  const supabase = createClient()

  const { data: todos, error } = await supabase.from('todos').select('*')

  if (error) {
    console.error('Supabase error:', error.message)
    return <p>❌ Failed to load todos</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">✅ Supabase Todos</h1>
      <ul className="mt-4">
        {todos?.map((todo) => (
          <li key={todo.id} className="mb-2">
            {todo.task} {todo.is_complete ? '✔️' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Just checking Supabase Connection