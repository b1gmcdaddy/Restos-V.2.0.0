import React, { useState } from 'react';
import {
  Flex,
  Spacer,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  ButtonGroup
} from '@chakra-ui/react';
import { CheckIcon, ChatIcon } from '@chakra-ui/icons';
import DescriptionModal from './components/DescriptionModal';

const App = () => {
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState('');

  const addTask = (e) => {
    e.preventDefault();

    if (newTask.length > 0) {
      setIncompleteTasks((prevTasks) => [
        ...prevTasks,
        { text: newTask, description: taskDescription }
      ]);
      setNewTask('');
      setTaskDescription('');
    }
  };

  const completeTask = (index) => {
    const taskToComplete = incompleteTasks[index];
    setIncompleteTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    setCompletedTasks((prevTasks) => [...prevTasks, taskToComplete]);
  };

  const openTaskDescriptionModal = (description) => {
    setSelectedTaskDescription(description);
    setIsModalOpen(true);
  };

  const closeTaskDescriptionModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flex w="100%" h="100vh">
        <Flex w="100%" flexDir="column" ml="20%" mt="5%" mr="20%" color="white">
          <Text fontWeight="700" fontSize={30}>
            Tasks
          </Text>
          <form onSubmit={addTask}>
            <Flex mt="2%">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                variant="flushed"
                placeholder="Add task"
                w="50%"
              />
              <Input
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                variant="flushed"
                placeholder="Task description"
                w="50%"
              />
              <Button onClick={addTask} ml={5} bg="blue.400">
                Add Task
              </Button>
            </Flex>
          </form>
          <Tabs mt="2%" w="100%">
            <TabList>
              <Tab>Incomplete Tasks</Tab>
              <Tab>Completed Tasks</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {incompleteTasks.map((task, index) => (
                  <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    completeTask={completeTask}
                    openTaskDescriptionModal={openTaskDescriptionModal}
                  />
                ))}
              </TabPanel>
              <TabPanel>
                {completedTasks.map((task, index) => (
                  <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    completeTask={completeTask}
                    isCompleted={true}
                    openTaskDescriptionModal={openTaskDescriptionModal}
                  />
                ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
      <DescriptionModal
        isOpen={isModalOpen}
        onClose={closeTaskDescriptionModal}
        description={selectedTaskDescription}
      />
    </>
  );
};

const TaskItem = ({ task, index, completeTask, isCompleted, openTaskDescriptionModal }) => {
  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Heading size="md">{task.text}</Heading>
      </Box>
      <Spacer />
      {!isCompleted && (
        <ButtonGroup gap="2">
          <IconButton icon={<ChatIcon />} onClick={() => openTaskDescriptionModal(task.description)} />
          <IconButton onClick={() => completeTask(index)} icon={<CheckIcon />} />
        </ButtonGroup>
      )}
    </Flex>
  );
};

export default App;
