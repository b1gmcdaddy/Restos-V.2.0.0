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
  //useStates
  const [newResto, setNewResto] = useState('');                                    
  const [restoDescription, setRestoDescription] = useState('');                     
  const [restoPlans, setRestoPlans] = useState([]);                                 
  const [doneRestos, setDoneRestos] = useState([]);                                
  const [isModalOpen, setIsModalOpen] = useState(false);                            
  const [selectedDescription, setSelectedDescription] = useState('');               

  //adding Resto to the list
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
  //updating resto to DONE list
  const doneResto = (index) => {
    const taskToComplete = restoPlans[index];
    setRestoPlans((prevTasks) => prevTasks.filter((_, i) => i !== index));
    setDoneRestos((prevTasks) => [...prevTasks, taskToComplete]);
  };

  //opening modal
  const openDescriptionModal = (description) => {
    setSelectedDescription(description);
    setIsModalOpen(true);
  };

  //closing modal
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
                placeholder="Resto description"
                w="50%"
              />
              <Button onClick={addResto} ml={5} bg="blue.400">
                Add Resto
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
                  <RestoFoodTrip
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
                  <RestoFoodTrip
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

  //content of TabPanel
const RestoFoodTrip = ({ resto, index, doneResto, isCompleted, openDescriptionModal }) => {
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
