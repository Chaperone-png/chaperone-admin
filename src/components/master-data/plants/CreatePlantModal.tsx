import { Modal } from 'antd';
import { AdminPlantTye } from '../../../types';
import CreatePlantForm from './CreatePlantForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  plantType?: any;
  plantDetails?: AdminPlantTye | null; // Add prop for passing plant details

}

const CreatePlantModal = ({ isOpen, onClose, onSuccess, plantType, plantDetails }: Props) => {
  return (
    <Modal
      destroyOnClose
      open={isOpen}
      title={plantType ? 'Edit plant' : 'Add new plant on directory'}
      onCancel={onClose}
      footer={null}
      style={{ top: 20 }}

      width={1000}
    >
      <CreatePlantForm onSuccess={onSuccess} plantDetails={plantDetails} />
    </Modal>
  );
};

export default CreatePlantModal;

