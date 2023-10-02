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
  ButtonGroup,
  Stack,
} from '@chakra-ui/react';                                                  
import { CheckIcon, ChatIcon, DeleteIcon } from '@chakra-ui/icons';         
import DescriptionModal from './components/DescriptionModal';              
import axios from 'axios';    
import bg2 from './assets/bg2.jpg';            
import './App.css';

//bg-image w styling
const bgImageStyle = {
  backgroundImage: `url(${bg2})`, 
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  minHeight: '100vh',
};

const contentBoxStyle = {
  backgroundColor: '#FFFAF0', 
  padding: '20px', 
  borderRadius: '10px', 
};


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
  }, [restoPlans]);
  

  //adding Resto to the list
  const addResto = (e) => {
    e.preventDefault();

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
            { resto_name: newResto, resto_desc: restoDescription },
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
    axios
      .put(`http://localhost:5000/updateStatus/${taskToComplete.id}`, {
        status: 'done',
      })
      .then((res) => {
        if (res.data.message === 'Status updated successfully') {
          taskToComplete.status = 'done';
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
    <div style={bgImageStyle}>
    <Flex alignItems="center" justifyContent="center" h="100vh">
      <Box style={contentBoxStyle} w={['100%', '50%']} p="20px" boxShadow="lg">
        <Flex flexDir="column" color="black">
          <Text fontWeight="700" fontSize={30} textAlign="center">
            Jolo and Ali's Foodtrips
          </Text>
          <form onSubmit={addResto}>
          <Stack spacing={3}>
            <Input placeholder='Enter restaurant name' size='md' 
            className='custom-input'
            borderBottomColor="gray.400" 
            _placeholder={{ opacity: 0.4, color: 'inherit' }}
            _hover={{ borderColor: 'black.700' }} 
            value={newResto}
            onChange={(e) => setNewResto(e.target.value)}
            />
            <Input placeholder='Enter description/notes' size='md' 
            className='custom-input2' 
            borderBottomColor="gray.400" 
            _placeholder={{ opacity: 0.4, color: 'inherit' }}
            _hover={{ borderColor: 'black.700' }} 
            value={restoDescription}
            onChange={(e) => setRestoDescription(e.target.value)}
            />
            <Button onClick={addResto} ml={5} bg="blue.700" _hover={{ bg: 'blue.600' }} mt={2}>
                ADD RESTO
              </Button>
          </Stack>
          </form>
          <Tabs mt="2%" w="100%">
            <TabList>
              <Tab variant='unstyled'>Foodtrips</Tab>
              <Tab variant='unstyled'>DONE</Tab>
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
        </Box>
      </Flex>
      <DescriptionModal
        isOpen={isModalOpen}
        onClose={closeDescriptionModal}
        description={selectedDescription}
      />
    </div>
  );
};

  //content of TabPanel
  const RestoFoodTrip = ({ resto, index, doneResto, deleteResto, isCompleted, openDescriptionModal }) => {
    const handleDelete = () => {
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
            <IconButton className='iconbuttons1' icon={<ChatIcon />} onClick={() => openDescriptionModal(resto.resto_desc)} color="yellow.600" border='1px solid' borderColor='black' />
            <IconButton className='iconbuttons2' icon={<CheckIcon />} onClick={() => doneResto(index)}  color="green.400" border='1px solid' borderColor='black'/>
          </ButtonGroup>
        )}
        {isCompleted && (
          <IconButton onClick={handleDelete} icon={<DeleteIcon />} color="red.500"  />
        )}
      </Flex>
    );
  };
  

export default App;
