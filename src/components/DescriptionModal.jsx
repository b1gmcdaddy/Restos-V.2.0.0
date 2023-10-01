import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

const DescriptionModal = ({ isOpen, onClose, description }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Task Description</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {description}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DescriptionModal;
