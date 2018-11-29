<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'content'
    ];

    function user()
    {
        return $this->belongsTo(User::class);
    }

    function review()
    {
        return $this->belongsTo(Review::class);
    }
}
