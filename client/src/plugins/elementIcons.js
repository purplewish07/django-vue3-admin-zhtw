import {
  Plus,
  Edit,
  Delete,
  Search,
  Refresh,
  RefreshLeft,
  Upload,
  ArrowDown,
  ArrowUp,
  Warning,
  Close
} from '@element-plus/icons-vue'

const components = {
  Plus,
  Edit,
  Delete,
  Search,
  Refresh,
  RefreshLeft,
  Upload,
  ArrowDown,
  ArrowUp,
  Warning,
  Close
}

export default {
  install(app) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}