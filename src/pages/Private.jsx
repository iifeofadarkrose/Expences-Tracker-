import { signOut } from "firebase/auth";
import { auth, db2 } from "../firebase";
import { AiOutlinePlus } from 'react-icons/ai';
import { useState, useEffect, useMemo } from 'react';
import Todo from "../components/Todo";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Discuss } from "react-loader-spinner";
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

export const Private = () => {
  const handleSignOut = () => {
    signOut(auth)
  };

  const style = {
    bg: `h-screen w-full p-4 cursor-default`,
    container: `bg-white max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
    heading: `text-3xl font-bold text-center text-gray-800 p-2`,
    form: `flex justify-between mb-5`,
    input: `border p-2 w-full text-xl`,
    button2: `border p-4 ml-2 bg-purple-500 text-white my-[5%] hover:bg-purple-600 transition duration-300 cursor-pointer`,
    button: `border p-4 ml-2 bg-purple-500 text-white hover:bg-purple-600 transition duration-300 cursor-pointer`,
    count: `text-center p-2 text-gray-700`,
    loaderContainer: `fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`,
    loader: `text-center`,
    error: `text-red-500 text-sm mt-1`, // Стили для сообщения об ошибке
  };
  
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // Состояние для сообщения об ошибке

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === '') {
      setError('Please enter a valid todo'); // Устанавливаем сообщение об ошибке
      return;
    }
    try {
      await addDoc(collection(db2, 'todos'), {
        text: input,
        completed: false,
      });
      setInput('');
      setError(''); // Сбрасываем сообщение об ошибке
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db2, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Update todo in firebase
  const toggleComplete = async (todo) => {
    try {
      await updateDoc(doc(db2, 'todos', todo.id), {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db2, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Мемоизация списка задач
  const memoizedTodos = useMemo(() => todos.map((todo, index) => (
    <Todo
      key={index}
      todo={todo}
      toggleComplete={toggleComplete}
      deleteTodo={deleteTodo}
    />
  )), [todos]);

  // Добавляем две функции для подсчета количества выполненных и невыполненных задач
  const countCompletedTodos = () => todos.filter(todo => todo.completed).length;
  const countUncompletedTodos = () => todos.filter(todo => !todo.completed).length;

  // Вычисляем процентное соотношение выполненных и невыполненных задач
  const completedPercentage = Math.round((countCompletedTodos() / todos.length) * 100);
  const uncompletedPercentage = 100 - completedPercentage;

  const data = {
    labels: ['Completed', 'Uncompleted'],
    datasets: [{
      data: [completedPercentage, uncompletedPercentage],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: `Tasks Completion Status (${completedPercentage}%)`,
      },
    },
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(''); // Сбрасываем сообщение об ошибке при изменении значения в инпуте
            }}
            className={style.input}
            type='text'
            placeholder='Add Todo'
          />
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        {error && <p className={style.error}>{error}</p>} {/* Отображаем сообщение об ошибке */}
        {isLoading ? (
          <div className={style.loaderContainer}>
            <Discuss
              visible={true}
              height="80"
              width="80"
              ariaLabel="discuss-loading"
              wrapperStyle={{}}
              wrapperClass="discuss-wrapper"
              color="#fff"
              backgroundColor="#F4442E"
            />
          </div>
        ) : (
          <ul>
            {memoizedTodos}
          </ul>
        )}
        {todos.length < 1 ? null : (
          <p className={style.count}>{`You have ${todos.length} todos`}</p>
        )} 
        <button className={style.button2} onClick={handleSignOut}>Sign Out</button>
        <div className="text-center mt-4">
          <p className="text-lg">Completed: {countCompletedTodos()}</p>
          <p className="text-lg">Uncompleted: {countUncompletedTodos()}</p>
        </div>

        <div className="text-center mt-4">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
