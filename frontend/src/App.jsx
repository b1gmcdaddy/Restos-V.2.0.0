import React, { useEffect, useState } from 'react';
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
import { CheckIcon, ChatIcon, DeleteIcon } from '@chakra-ui/icons';         
import DescriptionModal from './components/DescriptionModal';              
import axios from 'axios';                                                  


const App = () => {

  //useStates
  const [newResto, setNewResto] = useState('');                                    
  const [restoDescription, setRestoDescription] = useState('');                     
  const [restoPlans, setRestoPlans] = useState([]);                                 
  const [doneRestos, setDoneRestos] = useState([]);                                
  const [isModalOpen, setIsModalOpen] = useState(false);                            
  const [selectedDescription, setSelectedDescription] = useState('');  
  const [isLoading, setIsLoading] = useState(true);
  
  //useEffect for backend
  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then((res) => {
        const data = res.data;
        const togoRestos = data.filter((resto) => resto.status === 'togo');
        const doneRestos = data.filter((resto) => resto.status === 'done');
  
        setRestoPlans(togoRestos);
        setDoneRestos(doneRestos);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //adding Resto to the list
  const addResto = (e) => {

    if (newResto.length > 0) {
      const dataToInsert = {
        resto_name: newResto,
        resto_desc: restoDescription,
        status: 'togo', 
      };
  
      axios.post('http://localhost:5000/addResto', dataToInsert)
        .then((res) => {
          console.log('Data inserted successfully:', res.data);
  
          setRestoPlans((prevTasks) => [
            ...prevTasks,
            { text: newResto, description: restoDescription },
          ]);
          setNewResto('');
          setRestoDescription('');
        })
        .catch((err) => {
          console.error('Error inserting data:', err);
        });
    }
  };
  
  //updating resto to DONE list
  const doneResto = (index) => {
    const taskToComplete = restoPlans[index];
    
    axios.put(`http://localhost:5000/updateStatus/${taskToComplete.id}`, { status: 'done' })
      .then((res) => {
        if (res.data.message === 'Status updated successfully') {
          setRestoPlans((prevTasks) => prevTasks.filter((_, i) => i !== index));
          setDoneRestos((prevTasks) => [...prevTasks, taskToComplete]);
        }
      })
      .catch((err) => {
        console.error('Error updating status:', err);
      });
  };

  //delete resto
  const deleteResto = (id) => {
    axios.delete(`http://localhost:5000/deleteResto/${id}`)
      .then((res) => {
        if (res.data.message === 'Restaurant deleted successfully') {
          setDoneRestos((prevTasks) => prevTasks.filter((resto) => resto.id !== id));
        }
      })
      .catch((err) => {
        console.error('Error deleting restaurant:', err);
      });
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
              {isLoading ? (
              <div>Loading...</div>
                  ) : (
                    restoPlans.map((resto, index) => (
                    <RestoFoodTrip
                        key={index}
                        resto={resto}
                        index={index}
                        doneResto={doneResto}
                        openDescriptionModal={openDescriptionModal}
                    />
                  ))
              )}
              </TabPanel>
              <TabPanel>
                {doneRestos.map((resto, index) => (
                  <RestoFoodTrip
                    key={index}
                    resto={resto}
                    index={index}
                    doneResto={doneResto}
                    deleteResto={deleteResto}
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
  const RestoFoodTrip = ({ resto, index, doneResto, deleteResto, isCompleted, openDescriptionModal }) => {
    const handleDelete = () => {
      // Call the deleteResto function with the restaurant's ID
      deleteResto(resto.id);
    };
  
    return (
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <Box p="2">
          <Heading size="md">{resto.resto_name}</Heading>
        </Box>
        <Spacer />
        {!isCompleted && (
          <ButtonGroup gap="2">
            <IconButton icon={<ChatIcon />} onClick={() => openDescriptionModal(resto.resto_desc)} />
            <IconButton onClick={() => doneResto(index)} icon={<CheckIcon />} />
          </ButtonGroup>
        )}
        {isCompleted && (
          <IconButton onClick={handleDelete} icon={<DeleteIcon />} color="red.500" />
        )}
      </Flex>
    );
  };
  

export default App;
