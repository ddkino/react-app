import Loader from './Loader';
import LoadingWithText from './LoadingWithText';
import Nodata from './Nodata';
import Error from './Error';
import Success from './Success';

function  Render () {
};
Render.LoadingWithText = LoadingWithText;
Render.Loader = Loader;
Render.Nodata = Nodata;
Render.Error = Error;
Render.Success = Success;

export default Render;

export {LoadingWithText, Loader, Nodata, Error, Success}


