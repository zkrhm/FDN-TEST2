import MainLayout from '../index.js'
import { Table, Switch, Layout, Icon, Menu, message } from 'antd'
import Store from './store'
const axios = require('axios')

const { Header, Sider, Content } = Layout;
const dataSource = [{
  key: '1',
  name: 'Mike',
  age: 32,
  address: '10 Downing Street'
}, {
  key: '2',
  name: 'John',
  age: 42,
  address: '10 Downing Street'
}];
const pivotColumns = [{

}]

export default class Body extends React.Component {

  state = {
    collapsed: false,
    isPivot : false,
    data : [],
    header : []
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  errorHandler = (error)=>{
    message.error(`Unknown Error !`)
  }

  spyState = (isPivot)=>{
    console.log(`"Pivot is ${isPivot?'On':'Off'}"`)
    let _obj = this
    if(isPivot){
      
      Store.fetchPivot()
        .then((res)=>{
          _obj.setState({
            data: res.payload,
            header: res.header
          })
          console.log({res})
        }).catch(_obj.errorHandler)
    }else{
      Store.fetchNormal()
      .then((res)=>{
        _obj.setState({
          data: res.payload,
          header: res.header
        })
        console.log(res)
      }).catch(_obj.errorHandler)
    }
    this.setState({
      isPivot: isPivot
    })
  }

  componentDidMount(){
    let _obj = this
    Store.fetchNormal()
      .then((res)=>{
        _obj.setState({
          data: res.payload,
          header: res.header
        })
        console.log(res)
      }).catch(this.errorHandler)
  }

  render() {
    return (<MainLayout>
      <Layout>
      
      <Layout>
      <Header>
        <Icon
          className="trigger"
          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <Switch checkedChildren="Pivot On" unCheckedChildren="Pivot Off" onChange={this.spyState} />
      </Header>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
      
      <Table dataSource={this.state.data} columns={this.state.header}></Table>
      </Content>
      
      
      </Layout>
      </Layout>
    </MainLayout>)
  }
}
