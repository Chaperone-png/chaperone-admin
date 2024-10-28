import { Modal } from 'antd';
import { MaaliType } from '../../types';
import CreateMaaliForm from './CreateMaaliForm';


interface Props {
    visible: boolean;
    onCancel: () => void;
    maali: MaaliType | null;
    updateMaalis: () => Promise<void>;
}
const CreateMaaliModal = ({ visible, onCancel, maali, updateMaalis }: Props) => {
    return (
        <Modal
            open={visible}
            title={maali ? 'Edit Maali' : 'Add New Maali'}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <CreateMaaliForm maali={maali}/>
        </Modal>
    );
};

export default CreateMaaliModal;
