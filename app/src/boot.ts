import {bootstrap} from '@angular/platform-browser-dynamic'
import {AppComponent} from './components/app.component'
import {MomentTensorService} from './services/momenttensor.service'

bootstrap(AppComponent, [MomentTensorService])