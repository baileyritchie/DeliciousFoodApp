import '../sass/style.scss';
import typeAhead from './modules/typeAhead';
import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import makeMap from './modules/map';


autocomplete( $('#address'), $('#lat'), $('#lng') );

typeAhead($('.search'));

makeMap($('#map'));
