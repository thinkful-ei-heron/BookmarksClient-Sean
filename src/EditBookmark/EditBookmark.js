import React, { Component } from 'react';
import config from '../config'
import BookmarksContext from '../BookmarksContext';
import './editBookmark.css';

const Required = () => (
    <span className='AddBookmark__required'>*</span>
  )

class EditBookmark extends Component {

    state={
        error:null,
        id:'',
        title:'',
        url:'',
        description:'',
        rating:''
    }

    static contextType = BookmarksContext;

    setBookmark=(newBookmark)=>{
        this.setState({
            id:newBookmark.id,
            title:newBookmark.title,
            url:newBookmark.url,
            description:newBookmark.description,
            rating:newBookmark.rating,
        })
    }

    setTitle = (e) => {
        this.setState({title:e.target.value})
    }

    setUrl = (e) => {
        this.setState({url:e.target.value})
    }

    setDescription = (e) => {
        this.setState({description:e.target.value})
    }

    setRating = (e) => {
        this.setState({rating:e.target.value})
    }


    async componentDidMount(){
        await fetch((config.API_ENDPOINT + `${this.props.match.params.bookmarkId}`), { 
            method:'GET'
        })
              .then(res => {
                if (!res.ok) {
                  return res.json().then(error => Promise.reject(error))
                }
                return res.json()
              })
              .then(this.setBookmark)
              .catch(error => {
                console.error(error)
                this.setState({ error })
              })
    }


    handleSubmit=(e)=>{
        e.preventDefault();
        const { title, url, description, rating } = this.state
        const bookmark = {
        title: title,
        url: url,
        description: description,
        rating: rating,
        }
        fetch(config.API_ENDPOINT + `${this.props.match.params.bookmarkId}`,{
            method:'PATCH',
            body: JSON.stringify(bookmark),
            headers: {
                'content-type': 'application/json',
                //'authorization': `bearer ${config.API_KEY}`
              }
            })
             .then(res => {
                if (!res.ok) {
                  return res.json().then(error => Promise.reject(error))
                }
                //return res.json()
              })
              .then(() => {
                this.resetFields(bookmark)
                this.context.updateBookmark(bookmark)
                this.props.history.push('/')
              })
              .catch(error => {
                console.error(error)
                this.setState({ error })
              })
    }

    resetFields = (newFields) => {
        this.setState({
            id: newFields.id || '',
            title: newFields.title || '',
            url: newFields.url || '',
            description: newFields.description || '',
            rating: newFields.rating || '',
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
      };
    
    render() {
        const { error } = this.state
        return(
            <div className='EditBookmark'>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              onChange={(e)=>this.setTitle(e)}
              placeholder={this.state.title}
          
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              onChange={(e)=>this.setUrl(e)}
              placeholder={this.state.url}
             
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              onChange={(e)=>this.setDescription(e)}
              placeholder={this.state.description}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              onChange={(e)=>this.setRating(e)}
              placeholder={this.state.rating}
              //defaultValue={this.state.rating}
              min='1'
              max='5'
              
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
            </div>
        )
    }

}

export default EditBookmark