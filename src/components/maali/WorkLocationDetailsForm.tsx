import { Button, Form, Input, List } from 'antd';
import { useState } from 'react';

const WorkLocationDetailsForm = ({ form }: any) => {
    const [pincodes, setPincodes] = useState<string[]>([]);
    const [newPincode, setNewPincode] = useState('');
 
    const addPincode = () => {
        if (newPincode && !pincodes.includes(newPincode)) {
          setPincodes([...pincodes, newPincode]);
          setNewPincode('');
        }
      };
    
      const removePincode = (pincodeToRemove:string) => {
        setPincodes(pincodes.filter(pincode => pincode !== pincodeToRemove));
      };
    return (
        <div>
            <Form layout="inline" onFinish={addPincode} form={form}>
                <Form.Item>
                    <Input
                        placeholder="Enter Pincode"
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Pincode
                    </Button>
                </Form.Item>
            </Form>
            <List
                size="small"
                bordered
                dataSource={pincodes}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button type="link" onClick={() => removePincode(item)}>
                                Remove
                            </Button>,
                        ]}
                    >
                        {item}
                    </List.Item>
                )}
            />
        </div>
    )
}

export default WorkLocationDetailsForm