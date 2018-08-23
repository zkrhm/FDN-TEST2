import MainLayout from '../index.js'
import { Table, Switch, Layout, Icon, Menu, message } from 'antd'
import Store from './store'

const { Header, Sider, Content } = Layout;

export default class Body extends React.Component {
  state = {
    data: [],
    header: []
  }

  errorHandler = (error) => {
    message.error(`Unknown Error !`)
  }

  spyState = (isPivot) => {
    console.log(`"Pivot is ${isPivot ? 'On' : 'Off'}"`)
    let _obj = this
    if (isPivot) {

      Store.fetchPivot()
        .then((res) => {
          _obj.setState({
            data: res.payload,
            header: res.header
          })
          console.log({ res })
        }).catch(_obj.errorHandler)
    } else {
      Store.fetchNormal()
        .then((res) => {
          _obj.setState({
            data: res.payload,
            header: res.header
          })
          console.log(res)
        }).catch(_obj.errorHandler)
    }
  }

  componentDidMount() {
    let _obj = this
    Store.fetchNormal()
      .then((res) => {
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
