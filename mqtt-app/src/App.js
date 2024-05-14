import './App.css';
import mqtt from 'mqtt';
import react, { useState, useEffect } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LineChartOutlined,
  XFilled,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Card, Col, Row, Space, Modal } from 'antd';
//import { Line } from '@ant-design/plots';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';
//import{Line} from "react-chartjs-2"
const { Header, Sider, Content } = Layout;
const { Meta } = Card;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [co2Value, setco2Value] = useState(null);
  const [isModalvisible, setIsModalvisible] = useState(false);
  const [co2Data, setCo2Data] = useState([]);
  const [newData, setNewData] = useState([]);
  //const [currentTime, setCurrenTime] = useState(new Date())
  let time = 10;
  let chartRef = null;


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [message, setMessage] = useState([]);

  useEffect(() => {
    //const brokerUrl = 'mqtt://192.168.200.96';
    const option = {
      protocol: 'mqtt',
    };
    //const mqtt=require('mqtt');
    const client = mqtt.connect('ws://192.168.200.75:9001/mqtt', option);
    const topic = 'arrowgd/sensor/infineon/u/CO2-0102B6GD';
    client.on('connect', () => {
      client.subscribe(topic, { qos: 0 });
    });

    client.on('message', (topic, message) => {
      console.log(message.toString());
      const jsonString = JSON.parse(message.toString());
      setco2Value(jsonString.co2);
      console.log(jsonString.co2);
      console.log(time);
      const newCo2Data = { time: time, value: jsonString.co2 };
      time += 10;
      console.log(time);
      // const sortValues = Array.from(newCo2Data.value).sort((a,b)=>a-b);
      // newCo2Data.value=sortValues;
      setCo2Data(prevData => [...prevData, newCo2Data]);

      //setMessage(prevMessage => [...prevMessage, newMessage]);
    });

    return () => {
      client.end();
    };

  }, []);




  // useEffect(()=>{
  //   if(co2Data.length>0){
  //     const labels = co2Data.map(item => item.time.toLocaleTimeString());
  //     const values = co2Data.map(item=>item.value);

  //     if(chartRef){
  //       chartRef.co2Data.labels=labels;
  //       chartRef.co2Data.datasets[0].data=values;
  //       chartRef.update();
  //     }else{
  //       const ctx = document.getElementById('chart').getContext('2d');
  //       chartRef = new Chart(ctx,{
  //         type:'line',
  //         data:{
  //           labels,
  //           datasets:[
  //             {
  //               label:'MQTT Data',
  //               data:values,
  //               backgroundColor:'rgba(0,123,255,0.4)',
  //               borderColor:'rgba(0,123,255,1)',
  //               borderWidth:1,
  //               Fill:true,
  //             },
  //           ],
  //         },
  //         options:{
  //           responsive:true,
  //           maintainAspectRatio:false,
  //           scales:{
  //             x:{
  //               type:'time',
  //               time:{
  //                 unit:'second',
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }


  // },[co2Data]);

  // useEffect(()=>{
  //   const interval = setInterval(()=>{
  //     if (co2Value !== null) {
  //       //message = setMessage(message.toString());
  //       console.log(co2Value);
  //       console.log(time);
  //       const newCo2Data = { time: time, value: co2Value };
  //       setTime(time + 10);
  //       setCo2Data(prevData => [...prevData, newCo2Data]);
  //     }
  //   },80000);
  //   return()=>{
  //     clearInterval(interval);
  //   };
  // },[])

  const handleSvgClick = () => {
    setIsModalvisible(true);
    setNewData(co2Data);

  };

  const handleModalClose = () => {
    setIsModalvisible(false);
  };



  const data = [{ name: '0' }, { name: '360' }];
  const config = {
    data,
    xField: 'time',
    yField: 'value',
    // point: {
    //   shapeField: 'square',
    //   sizeField: 4,
    // },
    // interaction: {
    //   tooltip: {
    //     marker: false,
    //   },
    // },
    seriesField: 'type',
    style: {
      lineWidth: 2,
    },
  };

  return (
    <>
      <Layout style={{ height: '900px' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                label: 'CO2 SENSOR',
              },
              {
                key: '2',
                label: 'RADAR',
              },
              {
                key: '3',
                label: 'OTHER',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          {/* <div style={{ height: '150px', width: '200px', margin: '20px', border: '1px solid black', borderRadius: '10px', justifyContent: 'center', alignItems: 'center', flex: '1' }}>
            <div style={{ border: '1px solid black', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', height: '20px', textAlign: 'center', backgroundColor: '#DCDCDC' }}>
              <label>Co2 detect</label>
              <LineChartOutlined style={{ fontSize: '13px', float: 'right', marginTop: '2px', marginRight: '2px' }} onClick={handleSvgClick} />
            </div>
            <div style={{ fontSize: '60px', margin: '50px', marginBottom: '80px' }}>{co2Value}</div>
          </div> */}

          <Space direction="vertical" size={10} style={{margin:'30px',display:'flex'}}>
            <Card
              title="Co2 Detect"
              extra={<LineChartOutlined style={{ fontSize: '13px', float: 'right', marginTop: '2px', marginRight: '2px' }} onClick={handleSvgClick} />}
              style={{
                width: 200,
                height: 200,
                flex:'1'
              }}
            >
              <li style={{fontSize:'50px',marginLeft:'30px'}}>{co2Value}</li>
            </Card>
            <header style={{fontSize:'30px',marginLeft:'420px',marginTop:'30px'}}>Co2 Detect Value Line Chart</header>
            <LineChart width={1200} height={400} data={co2Data} style={{flex:'1',margin:'20px'}}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" type='number'>
              <Label offset={0} position="insideBottom" value="Time/S"></Label>
            </XAxis>
            <YAxis dataKey="value">
              <Label angle="-90" position="insideLeft" value="Co2 Value"></Label>
            </YAxis>
            <Tooltip />
          </LineChart>
          </Space>

          <Modal open={isModalvisible} onCancel={handleModalClose} height={2000} width={1000} style={{ top: 80, left: '15%' }}>
            {
              co2Data.map((item, index) => (
                <li key={index}>{JSON.stringify(item)}</li>
              ))
            }
            {/* <canvas id='chart' width="400" height="200"></canvas> */}
          </Modal>
        </Layout>
      </Layout>

    </>
  );
}

export default App;
