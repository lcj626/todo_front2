import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';

function CalendarView() {
  const [items, setItems] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [todoContent, setTodoContent] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 86400000);

    return () => clearInterval(interval);
  }, []);

  const loadItems = (day) => {
    const dateString = day.dateString;
    axios.get(`http://192.168.0.160:8080/api/todos?date=${dateString}`)
      .then(response => {
        const todos = response.data;
        const newItems = {
          [dateString]: todos.map(todo => ({
            name: todo.contents
          })),
        };
        setItems(newItems);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  };


  const addTodo = () =>{
      setShowAddForm(true);
  }

  const submitTodo = () =>{
      const newTodo = {
          contents : todoContent,
          registDate: selectedDate,
          isCompleted: false
      }
      axios.post('http://192.168.0.160:8080/api/todos', newTodo)
        .then(response => {
          console.log('Todo added:', response.data);
          loadItems({ dateString: selectedDate });
          setShowAddForm(false);
          setTodoContent('');
        })
        .catch(error => {
          console.error('Error adding todo:', error);
        });
    };




  const renderItem = (item) => (
    <View style={{ padding: 20 }}>
      <Text>{item.name}</Text>
    </View>
  );

  const renderEmptyDate = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No items for this date</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={addTodo}>
        <Text>Add Todo</Text>
      </TouchableOpacity>
      {showAddForm && (
        <View>
            <TextInput
              value={todoContent}
              onChangeText={text => setTodoContent(text)}
              placeholder="Enter Todo Content"
            />
            <Button title="Submit" onPress={submitTodo} />
        </View>
      )}
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
    </View>
  );
}

export default CalendarView;