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
} from '@chakra-ui/react';                                      //chakraUI components
import { CheckIcon, ChatIcon } from '@chakra-ui/icons';         //chakraUI icons
import DescriptionModal from './components/DescriptionModal';   //modal component

const App = () => {
  const [newResto, setNewResto] = useState('');                                     //useState for the input
  const [restoDescription, setRestoDescription] = useState('');                     //useState for the desc input
  const [restoPlans, setRestoPlans] = useState([]);                                 //array that holds the restos
  const [doneRestos, setDoneRestos] = useState([]);                                 //array that holds the completed restos
  const [isModalOpen, setIsModalOpen] = useState(false);                            //boolean whether modal is open or not
  const [selectedDescription, setSelectedDescription] = useState('');               //stores desc and stores in modal

  const addResto = (e) => {
    e.preventDefault();
    
    if (newResto.length > 0) {
      setRestoPlans((prevTasks) => [
        ...prevTasks,
        { text: newResto, description: restoDescription }
      ]);
      setNewResto('');
      setRestoDescription('');
    }
  };

  const doneResto = (index) => {
    const taskToComplete = restoPlans[index];
    setRestoPlans((prevTasks) => prevTasks.filter((_, i) => i !== index));
    setDoneRestos((prevTasks) => [...prevTasks, taskToComplete]);
  };

  const openDescriptionModal = (description) => {
    setSelectedDescription(description);
    setIsModalOpen(true);
  };

  const closeDescriptionModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flex w="100%" h="100vh">
        <Flex w="100%" flexDir="column" ml="20%" mt="5%" mr="20%" color="white">
          <Text fontWeight="700" fontSize={30}>
            Jolo and Ali's Foodtrips
          </Text>
          <form onSubmit={addResto}>
            <Flex mt="2%">
              <Input
                value={newResto}
                onChange={(e) => setNewResto(e.target.value)}
                variant="flushed"
                placeholder="Add resto"
                w="50%"
              />
              <Input
                value={restoDescription}
                onChange={(e) => setRestoDescription(e.target.value)}
                variant="flushed"
                placeholder="resto description"
                w="50%"
              />
              <Button onClick={addResto} ml={5} bg="blue.400">
                Add resto
              </Button>
            </Flex>
          </form>
          <Tabs mt="2%" w="100%">
            <TabList>
              <Tab>Foodtrips</Tab>
              <Tab>DONE</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {restoPlans.map((resto, index) => (
                  <TaskItem
                    key={index}
                    resto={resto}
                    index={index}
                    doneResto={doneResto}
                    openDescriptionModal={openDescriptionModal}
                  />
                ))}
              </TabPanel>
              <TabPanel>
                {doneRestos.map((resto, index) => (
                  <TaskItem
                    key={index}
                    resto={resto}
                    index={index}
                    doneResto={doneResto}
                    isCompleted={true}
                    openDescriptionModal={openDescriptionModal}
                  />
                ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
      <DescriptionModal
        isOpen={isModalOpen}
        onClose={closeDescriptionModal}
        description={selectedDescription}
      />
    </>
  );
};

const TaskItem = ({ resto, index, doneResto, isCompleted, openDescriptionModal }) => {
  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Heading size="md">{resto.text}</Heading>
      </Box>
      <Spacer />
      {!isCompleted && (
        <ButtonGroup gap="2">
          <IconButton icon={<ChatIcon />} onClick={() => openDescriptionModal(resto.description)} />
          <IconButton onClick={() => doneResto(index)} icon={<CheckIcon />} />
        </ButtonGroup>
      )}
    </Flex>
  );
};

export default App;
