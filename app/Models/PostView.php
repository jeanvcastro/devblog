<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PostView extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'post_id',
        'visitor_hash',
        'user_id',
        'visited_at',
    ];

    protected $hidden = ['id'];

    protected $casts = [
        'visited_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });

        static::created(function ($model) {
            $model->post()->increment('views_count');
        });
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
