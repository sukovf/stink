// BOOTSTRAP CORE COMPONENTS
import Button from './bootstrap/src/button';
import Collapse from './bootstrap/src/collapse';
import Modal from './bootstrap/src/modal';
import Popover from './bootstrap/src/popover';
import ScrollSpy from './bootstrap/src/scrollspy';
import Tab from './bootstrap/src/tab';
import Tooltip from './bootstrap/src/tooltip';

// MDB FREE COMPONENTS
import Input from './free/input';
import Dropdown from './free/dropdown';
import Ripple from './free/ripple';

// MDB PRO COMPONENTS
import Animate from './pro/animate';
import Alert from './pro/alert';
import Navbar from './pro/navbar';
import LazyLoad from './pro/lazyLoad';
import Popconfirm from './pro/popconfirm';
import Sticky from './pro/sticky';
import Select from './pro/select';
import Touch from './pro/touch';
import SmoothScroll from './pro/smooth-scroll';
import Autocomplete from './pro/autocomplete';

// AUTO INIT
[...document.querySelectorAll('[data-toggle="tooltip"]')].map((tooltip) => new Tooltip(tooltip));
[...document.querySelectorAll('[data-toggle="popover"]')].map((popover) => new Popover(popover));

export {
  // FREE
  Button,
  Collapse,
  Dropdown,
  Input,
  Modal,
  Popover,
  ScrollSpy,
  Ripple,
  Tab,
  Tooltip,
  // PRO
  Alert,
  Animate,
  Navbar,
  Popconfirm,
  SmoothScroll,
  LazyLoad,
  Sticky,
  Select,
  Touch,
  Autocomplete,
};
