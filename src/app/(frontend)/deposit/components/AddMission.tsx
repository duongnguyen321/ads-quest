import { INIT_AMOUNT_MISSION, INIT_REWARD_MISSION, RATE_POINT_TON } from '@/configs/ton.configs';
import { format } from '@/helpers/number.helpers';
import { Button, Divider, Input, Spacer, Textarea } from '@nextui-org/react';

function AddMission() {
  return (
    <>
      <h1>Add task</h1>
      <form>
        <Input label="Name of mission" />
        <Spacer />
        <Input label="Link of your mission" />
        <Spacer />
        <Textarea label="Description of mission" />
        <Spacer />
        <Divider />
        <Spacer />
        <Input type={'number'} label="Amount of mission" defaultValue={INIT_REWARD_MISSION.toString()} />
        <Spacer />
        <Button color={'primary'} className={'w-full'}>Add task</Button>
        <Spacer />
      </form>
      <i>By default, you must pay {INIT_AMOUNT_MISSION} <br /> with reward is: {format(INIT_REWARD_MISSION)} point.</i>
      <Spacer />
      <i>But if you change to up it, <br /> you must reward first 10 user <br /> with
        rate is: <b>{format(RATE_POINT_TON)} point = 1 TON</b></i>
    </>
  );
}

export default AddMission;
