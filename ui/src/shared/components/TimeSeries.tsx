// Library
import {Component} from 'react'
import _ from 'lodash'

// API
import {executeQueries} from 'src/shared/apis/v2/query'

// Types
import {RemoteDataState, FluxTable} from 'src/types'
import {DashboardQuery} from 'src/types/v2/dashboards'

// Utils
import {GlobalAutoRefresher} from 'src/utils/AutoRefresher'
import {parseResponse} from 'src/shared/parsing/flux/response'
import {restartable, CancellationError} from 'src/utils/restartable'

export const DEFAULT_TIME_SERIES = [{response: {results: []}}]

interface RenderProps {
  tables: FluxTable[]
  loading: RemoteDataState
  isInitialFetch: boolean
}

interface Props {
  link: string
  queries: DashboardQuery[]
  inView?: boolean
  children: (r: RenderProps) => JSX.Element
}

interface State {
  loading: RemoteDataState
  tables: FluxTable[]
  fetchCount: number
}

class TimeSeries extends Component<Props, State> {
  public static defaultProps = {
    inView: true,
  }

  private executeQueries = restartable(executeQueries)

  constructor(props: Props) {
    super(props)

    this.state = {
      loading: RemoteDataState.NotStarted,
      tables: [],
      fetchCount: 0,
    }
  }

  public async componentDidMount() {
    this.reload()

    GlobalAutoRefresher.subscribe(this.reload)
  }

  public componentWillUnmount() {
    GlobalAutoRefresher.unsubscribe(this.reload)
  }

  public async componentDidUpdate(prevProps: Props) {
    if (!this.isPropsDifferent(prevProps)) {
      return
    }

    this.reload()
  }

  public reload = async () => {
    const {link, inView, queries} = this.props

    if (!inView) {
      return
    }

    this.setState({
      loading: RemoteDataState.Loading,
      fetchCount: this.state.fetchCount + 1,
    })

    try {
      const results = await this.executeQueries(link, queries)
      const tables = _.flatten(results.map(r => parseResponse(r.csv)))

      this.setState({
        tables,
        loading: RemoteDataState.Done,
      })
    } catch (err) {
      if (err instanceof CancellationError) {
        return
      }

      console.error(err)
    }
  }

  public render() {
    const {tables, loading, fetchCount} = this.state

    return this.props.children({
      tables,
      loading,
      isInitialFetch: fetchCount === 1,
    })
  }

  private isPropsDifferent(nextProps: Props) {
    const isSourceDifferent = !_.isEqual(this.props.link, nextProps.link)

    return (
      this.props.inView !== nextProps.inView ||
      !!this.queryDifference(this.props.queries, nextProps.queries).length ||
      isSourceDifferent
    )
  }

  private queryDifference = (left, right) => {
    const mapper = q => `${q.text}`
    const l = left.map(mapper)
    const r = right.map(mapper)
    return _.difference(_.union(l, r), _.intersection(l, r))
  }
}

export default TimeSeries
